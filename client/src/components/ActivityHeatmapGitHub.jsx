import { useMemo, useState } from 'react';

const CELL = 11;
const GAP  = 3;
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const COLORS_LIGHT = ['#ebedf0','#9be9a8','#40c463','#30a14e','#216e39'];
const COLORS_DARK  = ['#161b22','#0e4429','#006d32','#26a641','#39d353'];

const intensity = (count) => {
  if (!count) return 0;
  if (count < 2) return 1;
  if (count < 4) return 2;
  if (count < 7) return 3;
  return 4;
};

const ActivityHeatmapGitHub = ({ data = [] }) => {
  const [tooltip, setTooltip] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const isDark =
    document.documentElement.classList.contains('theme-dark') ||
    document.documentElement.classList.contains('theme-eye');
  const colors = isDark ? COLORS_DARK : COLORS_LIGHT;

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];

  const { weeks, monthPositions, total } = useMemo(() => {
    const map = new Map();
    let total = 0;
    data.forEach(({ date, count }) => {
      if (!date) return;
      const key = new Date(date).toISOString().split('T')[0];
      const c = parseInt(count) || 0;
      map.set(key, c);
      total += c;
    });

    // Jan 1 of selected year
    const yearStart = new Date(selectedYear, 0, 1);
    const yearEnd   = new Date(selectedYear, 11, 31);

    // Snap back to Sunday before Jan 1
    const start = new Date(yearStart);
    start.setDate(start.getDate() - start.getDay());

    // Snap forward to Saturday after Dec 31
    const end = new Date(yearEnd);
    end.setDate(end.getDate() + (6 - end.getDay()));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    const cur = new Date(start);
    while (cur <= end) {
      const key = cur.toISOString().split('T')[0];
      const inYear = cur.getFullYear() === selectedYear;
      days.push({
        date: new Date(cur),
        key,
        count: inYear ? (map.get(key) || 0) : 0,
        outOfYear: !inYear,
        future: cur > today,
      });
      cur.setDate(cur.getDate() + 1);
    }

    // Chunk into weeks (columns of 7, Sun=0 … Sat=6)
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

    // Month label positions — first week where month[0] changes
    const monthPositions = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      // find first day in this week that belongs to selectedYear
      const rep = week.find(d => d.date.getFullYear() === selectedYear) || week[0];
      const m = rep.date.getMonth();
      if (m !== lastMonth) {
        monthPositions.push({ wi, label: MONTHS[m] });
        lastMonth = m;
      }
    });

    return { weeks, monthPositions, total };
  }, [data, selectedYear]);

  const colW = CELL + GAP;
  const LEFT_LABEL_W = 30; // px for Mon/Wed/Fri labels

  return (
    <div className="select-none w-full">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-text">
          <span className="font-bold">{total}</span> activities in {selectedYear}
        </p>
      </div>

      <div className="flex items-start gap-4">
        {/* Main grid */}
        <div className="flex-1 overflow-x-auto">
          <div style={{ display: 'inline-block', minWidth: '100%' }}>

            {/* Month labels row */}
            <div style={{ display: 'flex', marginLeft: LEFT_LABEL_W, marginBottom: 6, position: 'relative', height: 16 }}>
              {monthPositions.map(({ wi, label }) => (
                <span
                  key={wi + label}
                  style={{
                    position: 'absolute',
                    left: wi * colW,
                    fontSize: 12,
                    whiteSpace: 'nowrap',
                    fontWeight: 500,
                  }}
                  className="text-text/60"
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Day labels + cell grid */}
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              {/* Mon / Wed / Fri labels */}
              <div style={{ width: LEFT_LABEL_W, display: 'flex', flexDirection: 'column', gap: GAP, paddingTop: 1, flexShrink: 0 }}>
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d, i) => (
                  <div key={i} style={{ height: CELL, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 6 }}>
                    <span style={{ fontSize: 11 }} className="text-text/50">
                      {(i === 1 || i === 3 || i === 5) ? d : ''}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cell columns */}
              <div style={{ display: 'flex', gap: GAP }}>
                {weeks.map((week, wi) => (
                  <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
                    {week.map((day, di) => {
                      const level = (day.outOfYear || day.future) ? 0 : intensity(day.count);
                      const dimmed = day.outOfYear || day.future;
                      return (
                        <div
                          key={di}
                          style={{
                            width: CELL,
                            height: CELL,
                            borderRadius: 2,
                            backgroundColor: colors[level],
                            opacity: dimmed ? 0.25 : 1,
                            cursor: dimmed ? 'default' : 'pointer',
                          }}
                          onMouseEnter={(e) => {
                            if (day.outOfYear) return;
                            const r = e.currentTarget.getBoundingClientRect();
                            setTooltip({
                              x: r.left + r.width / 2,
                              y: r.top,
                              count: day.count,
                              date: day.date.toLocaleDateString('en-US', {
                                weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                              }),
                            });
                          }}
                          onMouseLeave={() => setTooltip(null)}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer: legend */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 8, marginLeft: LEFT_LABEL_W }}>
              <span style={{ fontSize: 11 }} className="text-text/40 mr-1">Less</span>
              {colors.map((c, i) => (
                <div key={i} style={{ width: CELL, height: CELL, borderRadius: 2, backgroundColor: c }} />
              ))}
              <span style={{ fontSize: 11 }} className="text-text/40 ml-1">More</span>
            </div>

          </div>
        </div>

        {/* Year selector — right side like GitHub */}
        <div className="flex flex-col gap-1 flex-shrink-0 pt-6">
          {years.map(y => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all text-right w-16 ${
                y === selectedYear
                  ? 'bg-primary text-white'
                  : 'text-text/50 hover:text-text hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y - 10,
            transform: 'translate(-50%, -100%)',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          <div style={{
            background: '#24292f',
            color: '#fff',
            fontSize: 12,
            fontWeight: 500,
            padding: '6px 10px',
            borderRadius: 6,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
          }}>
            <strong>{tooltip.count} {tooltip.count === 1 ? 'activity' : 'activities'}</strong> on {tooltip.date}
          </div>
          <div style={{
            width: 8, height: 8,
            background: '#24292f',
            transform: 'rotate(45deg)',
            margin: '-4px auto 0',
          }} />
        </div>
      )}
    </div>
  );
};

export default ActivityHeatmapGitHub;
