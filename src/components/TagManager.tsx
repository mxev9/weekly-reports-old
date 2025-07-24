import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { useScheduleStore, type Tag } from '@/hooks/useScheduleStore';
import { useTranslation } from '@/hooks/useTranslation';

const tagColors: Tag['color'][] = ['blue', 'purple', 'orange', 'pink', 'yellow', 'red'];

export function TagManager() {
  const [open, setOpen] = useState(false);
  const [tagName, setTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState<Tag['color']>('blue');
  const { tags, addTag, removeTag } = useScheduleStore();
  const { t } = useTranslation();

  const handleCreateTag = () => {
    if (tagName.trim()) {
      addTag(tagName.trim(), selectedColor);
      setTagName('');
      setSelectedColor('blue');
      setOpen(false);
    }
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
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Tags</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              {t('addTag')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('createTag')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tagName">{t('tagName')}</Label>
                <Input
                  id="tagName"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  placeholder="Enter tag name..."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Color</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {tagColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full ${getTagColorClass(color)} ${
                        selectedColor === color ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button onClick={handleCreateTag} disabled={!tagName.trim()}>
                  {t('createTag')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2 max-h-32 overflow-y-auto">
        {tags.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('noTags')}</p>
        ) : (
          tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between p-2 rounded-lg bg-muted"
            >
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getTagColorClass(tag.color)}`} />
                <span className="text-sm">{tag.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTag(tag.id)}
                className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}