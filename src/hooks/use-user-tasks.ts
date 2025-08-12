'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SavedWordDetails {
  word: string;
  definition: string;
  arabicWord: string;
  arabicDefinition: string;
  imageUrl?: string;
}

export interface SavedAdventureStart {
  narrative: string;
  imageUrl?: string | null;
  suggestions?: string[];
}

interface UserTasksState {
  // Quotas
  lingoleapGenCount: number;
  lingoleapSaved: SavedWordDetails[];
  textAdventureGenCount: number;
  textAdventureSaved: SavedAdventureStart[];
  storyGenCount: number;

  // Teacher usage tracking
  saraTopicsUsed: string[]; // unique
  ahmedTensesUsed: string[]; // unique

  // Media watched
  videosSeen: string[]; // YouTube ids
  shortsSeen: string[]; // YouTube ids

  // Chatterbot talk time (ms)
  chatterbotMsSpoken: number;

  // Methods
  addLingoleap(word: SavedWordDetails): void;
  addAdventureStart(start: SavedAdventureStart): void;
  incrementStory(): void;
  markSaraTopic(topic: string): void;
  markAhmedTense(tense: string): void;
  markVideoSeen(videoId: string): void;
  markShortSeen(videoId: string): void;
  addChatterbotMs(ms: number): void;
}

export const useUserTasks = create<UserTasksState>()(
  persist(
    (set, get) => ({
      lingoleapGenCount: 0,
      lingoleapSaved: [],
      textAdventureGenCount: 0,
      textAdventureSaved: [],
      storyGenCount: 0,
      saraTopicsUsed: [],
      ahmedTensesUsed: [],
      videosSeen: [],
      shortsSeen: [],
      chatterbotMsSpoken: 0,

      addLingoleap: (word) => set((state) => ({
        lingoleapGenCount: state.lingoleapGenCount + 1,
        lingoleapSaved: [...state.lingoleapSaved, word].slice(-50),
      })),

      addAdventureStart: (start) => set((state) => ({
        textAdventureGenCount: state.textAdventureGenCount + 1,
        textAdventureSaved: [...state.textAdventureSaved, start].slice(-10),
      })),

      incrementStory: () => set((state) => ({ storyGenCount: state.storyGenCount + 1 })),

      markSaraTopic: (topic) => set((state) => ({
        saraTopicsUsed: state.saraTopicsUsed.includes(topic) ? state.saraTopicsUsed : [...state.saraTopicsUsed, topic],
      })),

      markAhmedTense: (tense) => set((state) => ({
        ahmedTensesUsed: state.ahmedTensesUsed.includes(tense) ? state.ahmedTensesUsed : [...state.ahmedTensesUsed, tense],
      })),

      markVideoSeen: (videoId) => set((state) => ({
        videosSeen: state.videosSeen.includes(videoId) ? state.videosSeen : [...state.videosSeen, videoId],
      })),

      markShortSeen: (videoId) => set((state) => ({
        shortsSeen: state.shortsSeen.includes(videoId) ? state.shortsSeen : [...state.shortsSeen, videoId],
      })),

      addChatterbotMs: (ms) => set((state) => ({ chatterbotMsSpoken: state.chatterbotMsSpoken + ms })),
    }),
    {
      name: 'user-tasks-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);