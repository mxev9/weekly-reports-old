import { useState, useEffect } from 'react';
import { ScheduleGrid } from './ScheduleGrid';
import { ScheduleHeader } from './ScheduleHeader';
import { TagManager } from './TagManager';
import { ScheduleActions } from './ScheduleActions';
import { useScheduleStore } from '@/hooks/useScheduleStore';
import { usePrint } from '@/hooks/usePrint';

export function WeeklySchedule() {
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const { schedule, loadSchedule } = useScheduleStore();
  const { printSchedule } = usePrint();

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <ScheduleHeader 
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedDay={selectedDay}
          onDayChange={setSelectedDay}
          onPrint={printSchedule}
        />
        
        <div className="mt-6 space-y-6">
          <ScheduleGrid 
            viewMode={viewMode}
            selectedDay={selectedDay}
          />
          
          <div className="flex flex-col sm:flex-row gap-4">
            <TagManager />
            <ScheduleActions />
          </div>
        </div>
      </div>
    </div>
  );
}