import React, { useState, useCallback, useEffect } from 'react';
import type { Chat } from '@google/genai';
import { GamePanel } from './components/GamePanel';
import { VocabularyPanel } from './components/VocabularyPanel';
import { startGame, continueStory, getWordDefinition, generateWordImage } from './services/geminiService';
import type { GameState, StoryPart, VocabularyWord, LoadingStates, GameGenre } from './types';
import { GAME_GENRES } from './constants';
import { SparklesIcon } from './components/IconComponents';

const formatGenreName = (genre: string) => {
    return genre
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export default function App(): React.ReactNode {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [storyHistory, setStoryHistory] = useState<StoryPart[]>([]);
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  const [loading, setLoading] = useState<LoadingStates>({ story: false, vocab: false });
  const [chat, setChat] = useState<Chat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gameGenre, setGameGenre] = useState<GameGenre>('fantasy');

  const handleStartGame = useCallback(async () => {
    setLoading({ story: true, vocab: false });
    setError(null);
    setStoryHistory([]);
    setSelectedWord(null);

    try {
      const { chat: newChat, initialResponse } = await startGame(gameGenre);
      setChat(newChat);
      setStoryHistory([{
        id: Date.now(),
        sender: 'ai',
        text: initialResponse.narrative,
        vocabularyWord: initialResponse.newWord,
        suggestions: initialResponse.promptSuggestions
      }]);
      setGameState('playing');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setGameState('error');
    } finally {
      setLoading(prev => ({ ...prev, story: false }));
    }
  }, [gameGenre]);

  const handleSendAction = useCallback(async (action: string) => {
    if (!chat || !action.trim()) return;

    setLoading({ story: true, vocab: false });
    setError(null);
    setSelectedWord(null);

    const userActionPart: StoryPart = {
      id: Date.now(),
      sender: 'user',
      text: action,
    };
    setStoryHistory(prev => [...prev, userActionPart]);

    try {
      const response = await continueStory(chat, action);
      const aiResponsePart: StoryPart = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.narrative,
        vocabularyWord: response.newWord,
        suggestions: response.promptSuggestions,
      };
      setStoryHistory(prev => [...prev, aiResponsePart]);

      if (response.gameOver) {
        setGameState('gameOver');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get story update.');
      setGameState('error');
    } finally {
      setLoading(prev => ({ ...prev, story: false }));
    }
  }, [chat]);

  const handleWordClick = useCallback(async (word: string) => {
    if (!word) return;
    setLoading(prev => ({ ...prev, vocab: true }));
    setSelectedWord({ word, definition: 'Generating definition...', imageUrl: '' });
    setError(null);

    try {
      const definition = await getWordDefinition(word, gameGenre);
      setSelectedWord(prev => prev ? { ...prev, definition } : null);

      const imageUrl = await generateWordImage(word, definition, gameGenre);
      setSelectedWord(prev => prev ? { ...prev, imageUrl } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get vocabulary details.');
      setSelectedWord(prev => prev ? { ...prev, definition: 'Could not load details.', imageUrl: '' } : null);
    } finally {
      setLoading(prev => ({ ...prev, vocab: false }));
    }
  }, [gameGenre]);

  return (
    <div className="flex h-screen w-full bg-gray-900 font-sans">
      <main className="flex-1 flex flex-col p-4 md:p-6 h-screen relative">
        <header className="flex-shrink-0 flex items-center justify-between pb-4 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-purple-400" />
                Gemini Adventure
            </h1>
        </header>

        {gameState === 'setup' || gameState === 'gameOver' ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
             {gameState === 'gameOver' && <h2 className="text-4xl font-bold text-red-500 mb-4">Game Over</h2>}
            <p className="text-lg text-gray-300 mb-6">{gameState === 'setup' ? 'Choose a genre and begin your quest.' : 'Thanks for playing!'}</p>
            <div className="mb-6 w-full max-w-xs">
                <label htmlFor="genre-select" className="block text-sm font-medium text-gray-400 mb-2">Select Genre</label>
                <select 
                  id="genre-select"
                  value={gameGenre}
                  onChange={(e) => setGameGenre(e.target.value as GameGenre)}
                  className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                  disabled={loading.story}
                >
                  {GAME_GENRES.map(genre => <option key={genre} value={genre}>{formatGenreName(genre)}</option>)}
                </select>
            </div>
            <button
              onClick={handleStartGame}
              disabled={loading.story}
              className="px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading.story ? (
                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (gameState === 'gameOver' ? 'Play Again' : 'Start Adventure')}
            </button>
          </div>
        ) : (
          <div className="flex-grow flex overflow-hidden">
            <GamePanel 
              storyHistory={storyHistory} 
              onSendAction={handleSendAction} 
              onWordClick={handleWordClick}
              loading={loading.story}
              error={error}
            />
          </div>
        )}
      </main>
      <aside className="w-[30%] max-w-md hidden lg:flex flex-col bg-gray-800/50 border-l border-gray-700 h-screen">
        <VocabularyPanel selectedWord={selectedWord} loading={loading.vocab} />
      </aside>
    </div>
  );
}