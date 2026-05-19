import { useMemo, useState } from 'react';

const CELL = 13;   // cell size px
const GAP  = 3;    // gap between cells px

const DAY_LABELS  = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// GitHub green palette
const LIGHT_COLORS = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
const DARK_COLORS  = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];

const getIntensity = (count) => {
  if (!count || count === 0) return 0;
  if (count < 2)  return 1;
  if (count < 4)  return 2;
  if (count < 7)  return 3;
  return 4;
};

const ActivityHeatmap = ({ data = [] }) => {
  const [tooltip, setTooltip] = useState(null);

  const { weeks, monthLabels, totalCount } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Build activity map
    const activityMap = new Map();
    data.forEach(d => {
      if (!d.date) return;
      const key = new Date(d.date).toISOString().split('T')[0];
      activityMap.set(key, parseInt(d.count) || 0);
    });

    // Start from 52 weeks ago, aligned to Sunday
    const start = new Date(today);
    start.setDate(today.getDate() - 364);
    // Rewind to Sunday
    start.setDate(start.getDate() - start.getDay());

    const days = [];
    let totalCount = 0;
    const cur = new Date(start);

    while (cur <= today) {
      const key = cur.toISOString().split('T')[0];
      const count = activityMap.get(key) || 0;
      totalCount += count;
      days.push({
        date: new Date(cur),
        dateStr: key,
        count,
        intensity: getIntensity(count),
        isFuture: cur > today,
      });
      cur.setDate(cur.getDate() + 1);
    }

    // Chunk into weeks (columns of 7)
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    // Month labels: place label at the first week that starts in a new month
    const monthLabels = [];
    weeks.forEach((week, wi) => {
      const firstDay = week[0];
      const month = firstDay.date.getMonth();
      const prevWeekFirstDay = wi > 0 ? weeks[wi - 1][0].date.getMonth() : -1;
      if (month !== prevWeekFirstDay) {
        monthLabels.push({ weekIndex: wi, label: MONTH_NAMES[month] });
      }
    });

    return { weeks, monthLabels, totalCount };
  }, [data]);

  const isDark = document.documentElement.classList.contains('theme-dark') ||
                 document.documentElement.classList.contains('theme-eye');

  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  const totalWidth  = weeks.length * (CELL + GAP) - GAP;
  const totalHeight = 7 * (CELL + GAP) - GAP;

  return (
    <div className="w-full select-none">
      {/* Header */}
      <p className="text-sm font-semibold text-text/70 mb-3">
        <span className="font-bold text-text">{totalCount}</span> activities in the last year
      </p>

      <div className="overflow-x-auto pb-2">
        <div style={{ minWidth: totalWidth + 32 }}>
          {/* Month labels row */}
          <div className="flex ml-8 mb-1" style={{ gap: 0 }}>
            {weeks.map((_, wi) => {
              const label = monthLabels.find(m => m.weekIndex === wi);
              return (
                <div
                  key={wi}
                  style={{ width: CELL + GAP, flexShrink: 0 }}
                  className="relative"
                >
                  {label && (
                    <span className="absolute text-[11px] text-text/50 font-medium whitespace-nowrap">
                      {label.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grid + day labels */}
          <div className="flex items-start gap-1">
            {/* Day-of-week labels */}
            <div className="flex flex-col flex-shrink-0 mr-1" style={{ gap: GAP }}>
              {DAY_LABELS.map((label, i) => (
                <div
                  key={i}
                  style={{ height: CELL, width: 28 }}
                  className="flex items-center justify-end"
                >
                  <span className="text-[11px] text-text/40 font-medium">{label}</span>
                </div>
              ))}
            </div>

            {/* Cells */}
            <div className="relative flex" style={{ gap: GAP }}>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                  {week.map((day, di) => (
                    <div
                      key={di}
                      style={{
                        width: CELL,
                        height: CELL,
                        borderRadius: 2,
                        backgroundColor: day.isFuture ? colors[0] : colors[day.intensity],
                        opacity: day.isFuture ? 0.4 : 1,
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                          count: day.count,
                          date: day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-1 mt-3 ml-8">
            <span className="text-[11px] text-text/40 mr-1">Less</span>
            {colors.map((color, i) => (
              <div
                key={i}
                style={{ width: CELL, height: CELL, borderRadius: 2, backgroundColor: color }}
              />
            ))}
            <span className="text-[11px] text-text/40 ml-1">More</span>
          </div>
        </div>
      </div>

      {/* Tooltip — fixed to viewport */}
      {tooltip && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y - 8, transform: 'translate(-50%, -100%)' }}
        >
          <div className="bg-neutral-900 dark:bg-neutral-700 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-md shadow-xl whitespace-nowrap">
            <span className="font-bold">{tooltip.count} {tooltip.count === 1 ? 'activity' : 'activities'}</span>
            {' '}on {tooltip.date}
          </div>
          <div className="w-2 h-2 bg-neutral-900 dark:bg-neutral-700 rotate-45 mx-auto -mt-1" />
        </div>
      )}
    </div>
  );
};

export default ActivityHeatmap;
