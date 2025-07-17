'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ProgressState {
  // The title of the highest learning item (lesson or story) the user has successfully completed.
  highestItemCompleted: string | null;
  // Function to mark an item as completed.
  completeItem: (itemId: string) => void;
  // Function to reset all progress.
  resetProgress: () => void;
}

// We find the index of the completed item and the next item to determine access.
// This requires having the learningItems data available.
import { learningItems } from '@/lib/lessons';

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      highestItemCompleted: null,
      completeItem: (itemId: string) => {
        const currentHighestId = get().highestItemCompleted;
        const allItemTitles = learningItems.map(item => item.title);
        
        const currentIndex = currentHighestId ? allItemTitles.indexOf(currentHighestId) : -1;
        const newIndex = allItemTitles.indexOf(itemId);

        // Only update if the new item is "higher" (or the next one) than the current one.
        if (newIndex > currentIndex) {
          set({ highestItemCompleted: itemId });
        }
      },
      resetProgress: () => set({ highestItemCompleted: null }),
    }),
    {
      name: 'learning-progress-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
