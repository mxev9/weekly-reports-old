import { Button } from '@/components/ui/button';
import { Calendar, Grid3X3, Printer, Languages } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface ScheduleHeaderProps {
  viewMode: 'week' | 'day';
  onViewModeChange: (mode: 'week' | 'day') => void;
  selectedDay: number;
  onDayChange: (day: number) => void;
  onPrint: () => void;
}

export function ScheduleHeader({
  viewMode,
  onViewModeChange,
  selectedDay,
  onDayChange,
  onPrint
}: ScheduleHeaderProps) {
  const { t, language, toggleLanguage, days } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {t('weeklySchedule')}
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="gap-2"
        >
          <Languages className="h-4 w-4" />
          {language === 'en' ? 'العربية' : 'English'}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {viewMode === 'day' && (
          <select
            value={selectedDay}
            onChange={(e) => onDayChange(Number(e.target.value))}
            className="bg-schedule-header border border-schedule-border rounded-lg px-3 py-2 text-sm"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            {days.map((day, index) => (
              <option key={index} value={index}>
                {day}
              </option>
            ))}
          </select>
        )}

        <Button
          variant={viewMode === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('week')}
          className="gap-2"
        >
          <Grid3X3 className="h-4 w-4" />
          {t('weekView')}
        </Button>

        <Button
          variant={viewMode === 'day' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('day')}
          className="gap-2"
        >
          <Calendar className="h-4 w-4" />
          {t('dayView')}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onPrint}
          className="gap-2"
        >
          <Printer className="h-4 w-4" />
          {t('print')}
        </Button>
      </div>
    </div>
  );
}