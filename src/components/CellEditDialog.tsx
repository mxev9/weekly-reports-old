import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, Star, X } from 'lucide-react';
import { useScheduleStore, type ScheduleCell } from '@/hooks/useScheduleStore';
import { useTranslation } from '@/hooks/useTranslation';

interface CellEditDialogProps {
  day: number;
  hour: number;
  cell: ScheduleCell;
  onClose: () => void;
}

export function CellEditDialog({ day, hour, cell, onClose }: CellEditDialogProps) {
  const { tags, updateCell } = useScheduleStore();
  const { t, days } = useTranslation();
  const [selectedTags, setSelectedTags] = useState<string[]>(cell.tags);
  const [satisfaction, setSatisfaction] = useState<'check' | 'star' | undefined>(cell.satisfaction);

  const formatHour = (hour: number) => {
    if (hour === 0) return `12 ${t('am')}`;
    if (hour === 12) return `12 ${t('pm')}`;
    return hour < 12 ? `${hour} ${t('am')}` : `${hour - 12} ${t('pm')}`;
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSatisfactionToggle = (type: 'check' | 'star') => {
    setSatisfaction(prev => prev === type ? undefined : type);
  };

  const handleSave = () => {
    updateCell(day, hour, {
      tags: selectedTags,
      satisfaction,
    });
    onClose();
  };

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
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {days[day]} - {formatHour(hour)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tag Selection */}
          <div>
            <h4 className="text-sm font-medium mb-3">{t('selectTags')}</h4>
            {tags.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('noTags')}</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.id)}
                    className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedTags.includes(tag.id)
                        ? `${getTagColorClass(tag.color)} text-white border-transparent`
                        : 'bg-muted hover:bg-muted/80 border-border'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Satisfaction */}
          <div>
            <h4 className="text-sm font-medium mb-3">Satisfaction</h4>
            <div className="flex gap-2">
              <Button
                variant={satisfaction === 'check' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSatisfactionToggle('check')}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                Done
              </Button>
              <Button
                variant={satisfaction === 'star' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSatisfactionToggle('star')}
                className="gap-2"
              >
                <Star className="h-4 w-4" />
                Star
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}