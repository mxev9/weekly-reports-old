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
  
  // Debug logging
  console.log('ScheduleCell Debug:', {
    day,
    hour,
    cellTagIds: cell.tags,
    availableTags: tags,
    cellTags,
    satisfaction: cell.satisfaction
  });

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
      className="h-12 sm:h-16 p-1 cursor-pointer transition-colors hover:bg-schedule-cell-hover group relative overflow-visible"
      style={{ zIndex: 1 }}
      onClick={onClick}
    >
      <div className="h-full flex flex-col justify-between text-xs relative z-10">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 max-h-8 overflow-hidden relative z-20">
          {cellTags.slice(0, 2).map((tag) => (
            <span
              key={tag!.id}
              className={`inline-block px-1.5 py-0.5 rounded text-white text-xs font-medium relative z-30`}
              style={{ 
                backgroundColor: `hsl(var(--tag-${tag!.color}))`,
                minWidth: '20px',
                minHeight: '16px'
              }}
              title={tag!.name}
            >
              {tag!.name.slice(0, 6)}
              {tag!.name.length > 6 && '...'}
            </span>
          ))}
          {cellTags.length > 2 && (
            <span className="inline-block px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-xs relative z-30">
              +{cellTags.length - 2}
            </span>
          )}
        </div>

        {/* Satisfaction indicator */}
        <div className="flex justify-end relative z-20">
          {cell.satisfaction === 'check' && (
            <Check className="h-3 w-3 text-green-500 fill-current relative z-30" />
          )}
          {cell.satisfaction === 'star' && (
            <Star className="h-3 w-3 text-yellow-400 fill-current relative z-30" />
          )}
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}