import { useState } from 'react';
import { ScheduleCell } from './ScheduleCell';
import { CellEditDialog } from './CellEditDialog';
import { useScheduleStore } from '@/hooks/useScheduleStore';
import { useTranslation } from '@/hooks/useTranslation';
import midnightIcon from '@/assets/timeline-midnight.png';
import sunriseIcon from '@/assets/timeline-sunrise.png';
import noonIcon from '@/assets/timeline-noon.png';
import sunsetIcon from '@/assets/timeline-sunset.png';

interface ScheduleGridProps {
  viewMode: 'week' | 'day';
  selectedDay: number;
}

export function ScheduleGrid({ viewMode, selectedDay }: ScheduleGridProps) {
  const [editingCell, setEditingCell] = useState<{ day: number; hour: number } | null>(null);
  const { schedule } = useScheduleStore();
  const { days, isRTL } = useTranslation();

  const displayDays = viewMode === 'week' ? [0, 1, 2, 3, 4, 5, 6] : [selectedDay];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };

  const getTimelineIcon = (hour: number) => {
    if (hour >= 0 && hour < 6) return midnightIcon;
    if (hour >= 6 && hour < 12) return sunriseIcon;
    if (hour >= 12 && hour < 18) return noonIcon;
    if (hour >= 18 && hour < 24) return sunsetIcon;
    return midnightIcon;
  };

  const getTimelinePosition = (hour: number) => {
    // Position based on hour (0-24) as percentage of full day
    return (hour / 24) * 100;
  };

  return (
    <div className="bg-card rounded-xl border border-schedule-border shadow-card overflow-hidden relative">
      {/* Continuous timeline gradient waterfall */}
      <div className="absolute left-0 top-[48px] w-2 h-[calc(100%-48px)] bg-gradient-to-b from-slate-900 via-orange-400 via-yellow-300 via-blue-400 via-orange-500 to-slate-900 z-10">
        {/* Timeline icons */}
        <div className="absolute w-6 h-6 -left-2 top-0 transform -translate-y-1/2 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden">
          <img src={midnightIcon} alt="Midnight" className="w-4 h-4 object-cover rounded-full" />
        </div>
        <div className="absolute w-6 h-6 -left-2 top-1/4 transform -translate-y-1/2 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden">
          <img src={sunriseIcon} alt="Sunrise" className="w-4 h-4 object-cover rounded-full" />
        </div>
        <div className="absolute w-6 h-6 -left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden">
          <img src={noonIcon} alt="Noon" className="w-4 h-4 object-cover rounded-full" />
        </div>
        <div className="absolute w-6 h-6 -left-2 top-3/4 transform -translate-y-1/2 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden">
          <img src={sunsetIcon} alt="Sunset" className="w-4 h-4 object-cover rounded-full" />
        </div>
        <div className="absolute w-6 h-6 -left-2 bottom-0 transform translate-y-1/2 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden">
          <img src={midnightIcon} alt="Midnight" className="w-4 h-4 object-cover rounded-full" />
        </div>
      </div>
      
      <div className={`overflow-x-auto ${isRTL ? 'rtl' : ''}`}>
        <table className="w-full border-collapse">
          {/* Header */}
          <thead>
            <tr className="bg-schedule-header">
              <th className="sticky left-0 z-20 bg-schedule-header border-r border-schedule-border p-3 text-sm font-medium text-muted-foreground">
                Time
              </th>
              {displayDays.map((dayIndex) => (
                <th
                  key={dayIndex}
                  className="border-r border-schedule-border p-3 text-sm font-medium text-center min-w-24 sm:min-w-32"
                >
                  {days[dayIndex]}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {hours.map((hour) => (
              <tr key={hour} className="border-b border-schedule-border hover:bg-schedule-cell-hover/50">
                <td className="sticky left-0 z-20 bg-schedule-header border-r border-schedule-border p-0 relative">
                  <div className="flex items-center h-12 sm:h-16">
                    {/* Space for timeline gradient */}
                    <div className="w-2"></div>
                    
                    {/* Time text */}
                    <div className="flex-1 px-3 text-xs text-muted-foreground font-mono">
                      {formatHour(hour)}
                    </div>
                  </div>
                </td>
                {displayDays.map((dayIndex) => (
                  <td key={`${dayIndex}-${hour}`} className="border-r border-schedule-border p-0">
                    <ScheduleCell
                      day={dayIndex}
                      hour={hour}
                      cell={schedule[dayIndex][hour]}
                      onClick={() => setEditingCell({ day: dayIndex, hour })}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingCell && (
        <CellEditDialog
          day={editingCell.day}
          hour={editingCell.hour}
          cell={schedule[editingCell.day][editingCell.hour]}
          onClose={() => setEditingCell(null)}
        />
      )}
    </div>
  );
}