import type { GAME_GENRES } from "./constants";

export type GameState = 'setup' | 'playing' | 'gameOver' | 'error';
export type GameGenre = typeof GAME_GENRES[number];

export interface StoryPart {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  vocabularyWord?: string;
  suggestions?: string[];
}

export interface VocabularyWord {
  word: string;
  definition: string;
  imageUrl: string;
}

export interface LoadingStates {
  story: boolean;
  vocab: boolean;
}

export interface GameResponse {
  narrative: string;
  newWord: string | undefined;
  promptSuggestions: string[];
  gameOver: boolean;
}
