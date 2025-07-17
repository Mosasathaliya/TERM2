
export type GameState = 'setup' | 'playing' | 'gameOver' | 'error';
export type GameGenre = 'fantasy' | 'sci-fi' | 'mystery' | 'cyberpunk' | 'steampunk' | 'saudi-folklore';
export type TextAdventureAction = 'start' | 'continue';

export interface StoryPart {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  vocabularyWord?: string;
  suggestions?: string[];
  gameOver?: boolean;
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
