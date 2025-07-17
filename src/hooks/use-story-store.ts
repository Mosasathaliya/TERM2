
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SavedStory {
  id: string;
  prompt: string;
  content: string;
  imageUrl: string | null;
}

interface StoryState {
  stories: SavedStory[];
  addStory: (story: SavedStory) => void;
  clearStories: () => void;
}

const STORAGE_NAME = 'saved-stories-storage';

export const useStoryStore = create<StoryState>()(
  persist(
    (set) => ({
      stories: [],
      addStory: (story) =>
        set((state) => ({
          stories: [...state.stories, story].slice(-3), // Keep only the last 3 stories
        })),
      clearStories: () => set({ stories: [] }),
    }),
    {
      name: STORAGE_NAME,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
