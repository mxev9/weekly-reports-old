import { useState, useCallback } from 'react';

export interface Tag {
  id: string;
  name: string;
  color: 'blue' | 'purple' | 'orange' | 'pink' | 'yellow' | 'red';
}

export interface ScheduleCell {
  tags: string[];
  satisfaction?: 'check' | 'star';
}

export type Schedule = ScheduleCell[][]; // [day][hour]

const STORAGE_KEY = 'weekly-schedule-data';
const TAGS_STORAGE_KEY = 'weekly-schedule-tags';

export function useScheduleStore() {
  const [schedule, setSchedule] = useState<Schedule>(() => {
    // Initialize empty 7x24 grid
    return Array(7).fill(null).map(() => 
      Array(24).fill(null).map(() => ({ tags: [] }))
    );
  });

  const [tags, setTags] = useState<Tag[]>([]);

  const loadSchedule = useCallback(() => {
    try {
      const savedSchedule = localStorage.getItem(STORAGE_KEY);
      const savedTags = localStorage.getItem(TAGS_STORAGE_KEY);
      
      if (savedSchedule) {
        setSchedule(JSON.parse(savedSchedule));
      }
      
      if (savedTags) {
        setTags(JSON.parse(savedTags));
      }
    } catch (error) {
      console.error('Failed to load schedule:', error);
    }
  }, []);

  const saveSchedule = useCallback((newSchedule: Schedule) => {
    setSchedule(newSchedule);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSchedule));
  }, []);

  const saveTags = useCallback((newTags: Tag[]) => {
    setTags(newTags);
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(newTags));
  }, []);

  const updateCell = useCallback((day: number, hour: number, updates: Partial<ScheduleCell>) => {
    const newSchedule = schedule.map((daySchedule, dayIndex) =>
      dayIndex === day
        ? daySchedule.map((cell, hourIndex) =>
            hourIndex === hour ? { ...cell, ...updates } : cell
          )
        : daySchedule
    );
    saveSchedule(newSchedule);
  }, [schedule, saveSchedule]);

  const addTag = useCallback((name: string, color: Tag['color']) => {
    const newTag: Tag = {
      id: Date.now().toString(),
      name,
      color,
    };
    const newTags = [...tags, newTag];
    saveTags(newTags);
  }, [tags, saveTags]);

  const removeTag = useCallback((tagId: string) => {
    const newTags = tags.filter(tag => tag.id !== tagId);
    saveTags(newTags);

    // Remove the tag from all schedule cells
    const newSchedule = schedule.map(daySchedule =>
      daySchedule.map(cell => ({
        ...cell,
        tags: cell.tags.filter(id => id !== tagId),
      }))
    );
    saveSchedule(newSchedule);
  }, [tags, schedule, saveTags, saveSchedule]);

  const resetSchedule = useCallback(() => {
    const emptySchedule = Array(7).fill(null).map(() => 
      Array(24).fill(null).map(() => ({ tags: [] }))
    );
    saveSchedule(emptySchedule);
  }, [saveSchedule]);

  return {
    schedule,
    tags,
    loadSchedule,
    updateCell,
    addTag,
    removeTag,
    resetSchedule,
  };
}