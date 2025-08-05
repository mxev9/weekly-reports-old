import { useState, useCallback, useReducer } from 'react';

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

interface ScheduleState {
  schedule: Schedule;
  version: number;
}

type ScheduleAction = 
  | { type: 'UPDATE_CELL'; day: number; hour: number; updates: Partial<ScheduleCell> }
  | { type: 'LOAD_SCHEDULE'; schedule: Schedule }
  | { type: 'RESET_SCHEDULE' };

const scheduleReducer = (state: ScheduleState, action: ScheduleAction): ScheduleState => {
  switch (action.type) {
    case 'UPDATE_CELL':
      const newSchedule = state.schedule.map((daySchedule, dayIndex) =>
        dayIndex === action.day
          ? daySchedule.map((cell, hourIndex) =>
              hourIndex === action.hour ? { ...cell, ...action.updates } : cell
            )
          : daySchedule
      );
      return { schedule: newSchedule, version: state.version + 1 };
    
    case 'LOAD_SCHEDULE':
      return { schedule: action.schedule, version: state.version + 1 };
    
    case 'RESET_SCHEDULE':
      const emptySchedule = Array(7).fill(null).map(() => 
        Array(24).fill(null).map(() => ({ tags: [] }))
      );
      return { schedule: emptySchedule, version: state.version + 1 };
    
    default:
      return state;
  }
};

const STORAGE_KEY = 'weekly-schedule-data';
const TAGS_STORAGE_KEY = 'weekly-schedule-tags';

export function useScheduleStore() {
  const [state, dispatch] = useReducer(scheduleReducer, {
    schedule: (() => {
      // Try to load from localStorage first
      try {
        const savedSchedule = localStorage.getItem(STORAGE_KEY);
        if (savedSchedule) {
          return JSON.parse(savedSchedule);
        }
      } catch (error) {
        console.error('Failed to load initial schedule:', error);
      }
      
      // Initialize empty 7x24 grid if no saved data
      return Array(7).fill(null).map(() => 
        Array(24).fill(null).map(() => ({ tags: [] }))
      );
    })(),
    version: 0,
  });

  const [tags, setTags] = useState<Tag[]>(() => {
    // Load tags from localStorage on initialization
    try {
      const savedTags = localStorage.getItem(TAGS_STORAGE_KEY);
      return savedTags ? JSON.parse(savedTags) : [];
    } catch (error) {
      console.error('Failed to load tags:', error);
      return [];
    }
  });

  const loadSchedule = useCallback(() => {
    try {
      const savedSchedule = localStorage.getItem(STORAGE_KEY);
      
      if (savedSchedule) {
        dispatch({ type: 'LOAD_SCHEDULE', schedule: JSON.parse(savedSchedule) });
      }
      
      // Load tags separately to ensure they're always available
      const savedTags = localStorage.getItem(TAGS_STORAGE_KEY);
      if (savedTags) {
        setTags(JSON.parse(savedTags));
      }
    } catch (error) {
      console.error('Failed to load schedule:', error);
    }
  }, []);

  const saveTags = useCallback((newTags: Tag[]) => {
    setTags(newTags);
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(newTags));
  }, []);

  const updateCell = useCallback((day: number, hour: number, updates: Partial<ScheduleCell>) => {
    console.log('updateCell called with reducer:', { day, hour, updates, currentVersion: state.version });
    
    dispatch({ type: 'UPDATE_CELL', day, hour, updates });
    
    // Save to localStorage after state update
    const newSchedule = state.schedule.map((daySchedule, dayIndex) =>
      dayIndex === day
        ? daySchedule.map((cell, hourIndex) =>
            hourIndex === hour ? { ...cell, ...updates } : cell
          )
        : daySchedule
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSchedule));
  }, [state.schedule, state.version]);

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
    const newSchedule = state.schedule.map(daySchedule =>
      daySchedule.map(cell => ({
        ...cell,
        tags: cell.tags.filter(id => id !== tagId),
      }))
    );
    dispatch({ type: 'LOAD_SCHEDULE', schedule: newSchedule });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSchedule));
  }, [tags, state.schedule, saveTags]);

  const resetSchedule = useCallback(() => {
    dispatch({ type: 'RESET_SCHEDULE' });
    const emptySchedule = Array(7).fill(null).map(() => 
      Array(24).fill(null).map(() => ({ tags: [] }))
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emptySchedule));
  }, []);

  return {
    schedule: state.schedule,
    tags,
    version: state.version,
    loadSchedule,
    updateCell,
    addTag,
    removeTag,
    resetSchedule,
  };
}