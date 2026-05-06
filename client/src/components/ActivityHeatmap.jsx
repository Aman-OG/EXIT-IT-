import React, { useMemo } from 'react';

const ActivityHeatmap = ({ data = [] }) => {
  // data = [{ date: '2023-10-10...', count: 5 }, ...]
  
  const { weeks, monthLabels, totalCount, startDateStr, endDateStr, years } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const activityMap = new Map();
    data.forEach(d => {
      if (!d.date) return;
      const dateStr = new Date(d.date).toISOString().split('T')[0];
      activityMap.set(dateStr, parseInt(d.count));
    });

    const numWeeks = 53; 
    const days = [];
    
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (numWeeks * 7 - 1) - today.getDay());
    
    const months = [];
    let currentMonth = -1;
    let totalCount = 0;

    for (let i = 0; i < numWeeks * 7; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        
        const dateStr = d.toISOString().split('T')[0];
        const count = activityMap.get(dateStr) || 0;
        totalCount += count;
        
        // Intensity 0-4
        let intensity = 0;
        if (count > 0 && count < 2) intensity = 1;
        else if (count >= 2 && count < 4) intensity = 2;
        else if (count >= 4 && count < 7) intensity = 3;
        else if (count >= 7) intensity = 4;

        days.push({
            date: d,
            dateStr,
            count,
            intensity,
            isFuture: d > today
        });
        
        if (i % 7 === 0) {
            const m = d.getMonth();
            if (m !== currentMonth) {
                months.push({ name: d.toLocaleString('default', { month: 'short' }), weekIndex: i / 7 });
                currentMonth = m;
            } else {
                months.push({ name: null, weekIndex: i / 7 });
            }
        }
    }

    const weeksArr = [];
    for (let i = 0; i < days.length; i += 7) {
        weeksArr.push(days.slice(i, i + 7));
    }

    const startStr = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' });
    const endStr = today.toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' });
    
    return { 
      weeks: weeksArr, 
      monthLabels: months, 
      totalCount, 
      startDateStr: startStr, 
      endDateStr: endStr,
      years: [today.getFullYear(), today.getFullYear() - 1, today.getFullYear() - 2]
    };
  }, [data]);

  const getIntensityClass = (intensity, isFuture) => {
    if (isFuture) return 'bg-[#ebedf0] dark:bg-[#161b22] opacity-50';
    switch (intensity) {
        case 1: return 'bg-[#9be9a8] dark:bg-[#0e4429]';
        case 2: return 'bg-[#40c463] dark:bg-[#006d32]';
        case 3: return 'bg-[#30a14e] dark:bg-[#26a641]';
        case 4: return 'bg-[#216e39] dark:bg-[#39d353]';
        default: return 'bg-[#ebedf0] dark:bg-[#161b22]'; 
    }
  };

  return (
    <div className="flex select-none gap-8">
      {/* Main Heatmap Area */}
      <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-text">
                {totalCount} activities in the last year
              </p>
              <div className="text-[10px] font-bold text-text/40 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                {startDateStr} - {endDateStr}
              </div>
          </div>

          <div className="flex ml-8 mb-1">
            {monthLabels.map((m, i) => (
              <div key={i} className="flex-shrink-0 w-[10px] h-[10px] mr-[2px]">
                {m.name && <span className="text-[9px] text-text/50 font-medium absolute translate-y-[-2px]">{m.name}</span>}
              </div>
            ))}
          </div>

          <div className="flex items-start">
            <div className="flex flex-col text-[9px] text-text/40 pr-2 pt-1 gap-[11px] h-full justify-start mt-[1px]">
                <span className="leading-none">Sun</span>
                <span className="leading-none">Tue</span>
                <span className="leading-none">Thu</span>
                <span className="leading-none">Sat</span>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden pb-1 scrollbar-none">
                <div className="flex gap-[2px]">
                    {weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-[2px]">
                        {week.map((day, dIdx) => (
                            <div 
                            key={dIdx} 
                            className={`w-[10px] h-[10px] rounded-[1px] cursor-pointer transition-colors duration-200 hover:ring-1 hover:ring-primary/50 relative group ${getIntensityClass(day.intensity, day.isFuture)}`}
                            >
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none">
                                    <div className="bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap">
                                        {day.count} activities on {new Date(day.date).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    ))}
                </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-1 mt-3 mr-2 text-[9px] text-text/50 font-medium pb-2">
             <span>Less</span>
             <div className="w-[10px] h-[10px] rounded-[1px] bg-[#ebedf0] dark:bg-[#161b22]" />
             <div className="w-[10px] h-[10px] rounded-[1px] bg-[#9be9a8] dark:bg-[#0e4429]" />
             <div className="w-[10px] h-[10px] rounded-[1px] bg-[#40c463] dark:bg-[#006d32]" />
             <div className="w-[10px] h-[10px] rounded-[1px] bg-[#30a14e] dark:bg-[#26a641]" />
             <div className="w-[10px] h-[10px] rounded-[1px] bg-[#216e39] dark:bg-[#39d353]" />
             <span>More</span>
          </div>
      </div>

      {/* Year Sidebar (GitHub Style) */}
      <div className="hidden lg:flex flex-col gap-1 pt-10">
          {years.map(y => (
            <button 
              key={y} 
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all text-left w-24 ${y === years[0] ? 'bg-primary text-white shadow-lg' : 'text-text/40 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
            >
              {y}
            </button>
          ))}
          <div className="mt-4 p-3 bg-primary/5 border border-primary/10 rounded-xl">
             <p className="text-[10px] font-black uppercase text-primary tracking-widest leading-tight">Mastered</p>
             <p className="text-xs font-bold text-text/60">Full Cycle</p>
          </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
