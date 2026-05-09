import React, { useMemo } from 'react';

const ActivityHeatmap = ({ contributions = {}, year = 2024 }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  
  // Get the first day of the year and calculate starting week day
  let firstDayOfWeek = startDate.getDay();
  const startOfFirstWeek = new Date(startDate);
  startOfFirstWeek.setDate(startDate.getDate() - firstDayOfWeek);
  
  // Generate all weeks
  const weeks = [];
  let currentDate = new Date(startOfFirstWeek);
  
  while (currentDate <= endDate) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(week);
  }
  
  // Color intensity based on contribution count
  const getColor = (count) => {
    const colors = {
      0: 'bg-neutral-100 dark:bg-neutral-800',
      1: 'bg-primary/20',
      2: 'bg-primary/40',
      3: 'bg-primary/60',
      4: 'bg-primary/80',
      5: 'bg-primary',
    };
    
    if (count === 0) return colors[0];
    if (count <= 5) return colors[1];
    if (count <= 10) return colors[2];
    if (count <= 20) return colors[3];
    if (count <= 40) return colors[4];
    return colors[5];
  };
  
  const getContributionCount = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return contributions[dateStr] || 0;
  };
  
  const currentMonth = useRef(-1);
  const monthLabels = [];
  
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-text mb-2">Activity Heatmap</h3>
        <p className="text-text/60 text-sm">Study streak activity for {year}</p>
      </div>
      
      {/* Heatmap */}
      <div className="overflow-x-auto pb-4">
        <div className="inline-block">
          {/* Week day labels */}
          <div className="flex mb-2">
            <div className="w-12" /> {/* Space for month labels */}
            <div className="flex gap-1">
              {weekDays.map((day, idx) => (
                <div key={idx} className="w-4 h-4 flex items-center justify-center text-xs font-medium text-text/50">
                  {day.charAt(0)}
                </div>
              ))}
            </div>
          </div>
          
          {/* Months and heatmap grid */}
          <div className="flex gap-1">
            {/* Month labels */}
            <div className="flex flex-col justify-between pr-2 text-xs font-medium text-text/60">
              {months.map((month, idx) => (
                <div key={idx} className="h-6 flex items-center">
                  {idx % 2 === 0 ? month : ''}
                </div>
              ))}
            </div>
            
            {/* Weeks grid */}
            <div className="flex gap-1">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1">
                  {week.map((date, dayIdx) => {
                    const count = getContributionCount(date);
                    const isCurrentYear = date.getFullYear() === year;
                    const isToday = 
                      date.toDateString() === new Date().toDateString();
                    
                    return (
                      <div
                        key={`${weekIdx}-${dayIdx}`}
                        className={`
                          w-3 h-3 rounded cursor-pointer transition-all duration-200 
                          ${isCurrentYear ? getColor(count) : 'bg-neutral-50 dark:bg-neutral-900'}
                          ${isToday ? 'ring-2 ring-primary' : ''}
                          hover:scale-125 hover:shadow-lg hover:z-10
                          group relative
                        `}
                        title={`${date.toDateString()}: ${count} studies`}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-text text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {count} stud{count !== 1 ? 'ies' : 'y'} on {date.toDateString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <span className="text-xs font-medium text-text/60">Less</span>
        {[0, 1, 2, 3, 4, 5].map((intensity) => (
          <div
            key={intensity}
            className={`w-3 h-3 rounded ${getColor(intensity === 0 ? 0 : intensity * 10)}`}
            title={`${intensity === 0 ? 'No' : (intensity * 10 - 5)} studies`}
          />
        ))}
        <span className="text-xs font-medium text-text/60">More</span>
      </div>
    </div>
  );
};

const useRef = (initialValue) => {
  const ref = React.useRef(initialValue);
  return ref;
};

export default ActivityHeatmap;
