import { useState } from 'react';
import { ScheduleCell } from './ScheduleCell';
import { CellEditDialog } from './CellEditDialog';
import { useScheduleStore } from '@/hooks/useScheduleStore';
import { useTranslation } from '@/hooks/useTranslation';

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
    if (hour === 0) return '🌙';
    if (hour >= 6 && hour < 12) return '🌅';
    if (hour === 12) return '☀️';
    if (hour > 12 && hour < 18) return '🌞';
    if (hour >= 18 && hour < 24) return '🌙';
    return '🌙';
  };

  const getTimelinePosition = (hour: number) => {
    // Create a smooth transition from top (midnight) to middle (noon) to bottom (midnight)
    const normalizedHour = hour / 24 * 100;
    return normalizedHour;
  };

  return (
    <div className="bg-card rounded-xl border border-schedule-border shadow-card overflow-hidden">
      <div className={`overflow-x-auto ${isRTL ? 'rtl' : ''}`}>
        <table className="w-full border-collapse">
          {/* Header */}
          <thead>
            <tr className="bg-schedule-header">
              <th className="sticky left-0 z-10 bg-schedule-header border-r border-schedule-border p-3 text-sm font-medium text-muted-foreground">
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
                <td className="sticky left-0 z-10 bg-schedule-header border-r border-schedule-border p-0 relative">
                  <div className="flex items-center h-12 sm:h-16">
                    {/* Timeline gradient trim */}
                    <div className="w-1 h-full bg-gradient-to-b from-primary/20 via-primary to-primary/20 relative">
                      <div 
                        className="absolute w-3 h-3 -left-1 transform -translate-y-1/2 bg-primary rounded-full flex items-center justify-center text-xs"
                        style={{ top: `${getTimelinePosition(hour)}%` }}
                      >
                        <span className="text-xs">{getTimelineIcon(hour)}</span>
                      </div>
                    </div>
                    
                    {/* Time text */}
                    <div className="flex-1 px-2 text-xs text-muted-foreground font-mono">
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