'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ProgressState {
  // The ID of the highest lesson the user has successfully completed.
  // We'll use the lesson_id (string) for this.
  highestLessonCompleted: string | null;
  // Function to mark a lesson as completed.
  completeLesson: (lessonId: string) => void;
  // Function to reset all progress.
  resetProgress: () => void;
}

// We find the index of the completed lesson and the next lesson to determine access.
// This requires having the lessons data available.
import { learningItems } from '@/lib/lessons';

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      highestLessonCompleted: null,
      completeLesson: (lessonId: string) => {
        const currentHighestId = get().highestLessonCompleted;
        const allLessonIds = learningItems.map(item => item.type === 'lesson' ? item.title : null).filter(Boolean) as string[];
        
        const currentIndex = currentHighestId ? allLessonIds.indexOf(currentHighestId) : -1;
        const newIndex = allLessonIds.indexOf(lessonId);

        // Only update if the new lesson is "higher" than the current one.
        if (newIndex > currentIndex) {
          set({ highestLessonCompleted: lessonId });
        }
      },
      resetProgress: () => set({ highestLessonCompleted: null }),
    }),
    {
      name: 'learning-progress-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
