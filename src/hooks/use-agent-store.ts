'use client';

/**
 * @fileoverview Zustand store for managing the AI agent's state.
 * This includes the list of available agents, the currently selected agent,
 * and user settings that can personalize the agent's behavior.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the structure for a single AI agent
export interface Agent {
  name: string;
  personality: string;
  bodyColor: string;
  voice:
    | 'Alloy' | 'Echo' | 'Fable' | 'Onyx' | 'Nova' | 'Shimmer'
    | 'en-US-Standard-A' | 'en-US-Standard-B' | 'en-US-Standard-C' | 'en-US-Standard-D'
    | 'Algenib' | 'Antares' | 'Sirius';
}

// Define the structure for user settings
export interface UserSettings {
  name: string;
  info: string;
}

// Define the structure of the entire store's state
interface AgentState {
  agents: Agent[];
  currentAgent: Agent;
  userSettings: UserSettings;
  audioLevel: number;
  setCurrentAgent: (agent: Agent) => void;
  setUserSettings: (settings: UserSettings) => void;
  setAudioLevel: (level: number) => void;
}

// Define the default list of agents
const defaultAgents: Agent[] = [
  {
    name: 'Botty',
    personality: 'A friendly and helpful AI assistant.',
    bodyColor: '#9333ea', // purple-600
    voice: 'Nova',
  },
  {
    name: 'Captain Jack',
    personality: 'A witty and adventurous pirate captain with a love for treasure and a good joke.',
    bodyColor: '#ca8a04', // yellow-600
    voice: 'Onyx',
  },
  {
    name: 'Professor Axiom',
    personality: 'A brilliant, slightly eccentric professor of theoretical physics who explains things with elaborate analogies.',
    bodyColor: '#1d4ed8', // blue-700
    voice: 'Fable',
  },
];

// Create the Zustand store with persistence middleware
export const useAgentStore = create<AgentState>()(
  persist(
    (set) => ({
      // State
      agents: defaultAgents,
      currentAgent: defaultAgents[0],
      userSettings: {
        name: '',
        info: '',
      },
      audioLevel: 0,

      // Actions
      setCurrentAgent: (agent) => set({ currentAgent: agent }),
      setUserSettings: (settings) => set({ userSettings: settings }),
      setAudioLevel: (level) => set({ audioLevel: level }),
    }),
    {
      // Configuration for the persistence middleware
      name: 'agent-storage', // Name for the storage item in localStorage
    }
  )
);
