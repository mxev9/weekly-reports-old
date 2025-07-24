import { Check, Star } from 'lucide-react';
import { useScheduleStore, type ScheduleCell as ScheduleCellType } from '@/hooks/useScheduleStore';

interface ScheduleCellProps {
  day: number;
  hour: number;
  cell: ScheduleCellType;
  onClick: () => void;
}

export function ScheduleCell({ day, hour, cell, onClick }: ScheduleCellProps) {
  const { tags } = useScheduleStore();

  const cellTags = cell.tags.map(tagId => tags.find(tag => tag.id === tagId)).filter(Boolean);

  const getTagColorClass = (color: string) => {
    const colorMap = {
      blue: 'bg-tag-blue',
      purple: 'bg-tag-purple',
      orange: 'bg-tag-orange',
      pink: 'bg-tag-pink',
      yellow: 'bg-tag-yellow',
      red: 'bg-tag-red',
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-primary';
  };

  return (
    <div
      className="h-12 sm:h-16 p-1 cursor-pointer transition-colors hover:bg-schedule-cell-hover group relative"
      onClick={onClick}
    >
      <div className="h-full flex flex-col justify-between text-xs">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 max-h-8 overflow-hidden">
          {cellTags.slice(0, 2).map((tag) => (
            <span
              key={tag!.id}
              className={`inline-block px-1.5 py-0.5 rounded text-white text-xs font-medium ${getTagColorClass(tag!.color)}`}
              title={tag!.name}
            >
              {tag!.name.slice(0, 6)}
              {tag!.name.length > 6 && '...'}
            </span>
          ))}
          {cellTags.length > 2 && (
            <span className="inline-block px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-xs">
              +{cellTags.length - 2}
            </span>
          )}
        </div>

        {/* Satisfaction indicator */}
        <div className="flex justify-end">
          {cell.satisfaction === 'check' && (
            <Check className="h-3 w-3 text-primary" />
          )}
          {cell.satisfaction === 'star' && (
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
          )}
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}