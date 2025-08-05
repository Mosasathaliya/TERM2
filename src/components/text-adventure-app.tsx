
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { GamePanel } from '@/components/adventure-game-panel';
import { VocabularyPanel } from '@/components/adventure-vocabulary-panel';
import { textAdventureFlow, defineWord, generateImageForWord } from '@/ai/flows/text-adventure-flow';
import type { GameState, StoryPart, VocabularyWord, LoadingStates, GameGenre, TextAdventureAction, TranslationState } from '@/lib/adventure-game-types';
import { textToSpeech } from '@/ai/flows/tts-flow';
import { translateText } from '@/ai/flows/translate-flow';
import { useToast } from "@/hooks/use-toast";

const GAME_GENRES: GameGenre[] = ['fantasy', 'sci-fi', 'mystery', 'cyberpunk', 'steampunk', 'saudi-folklore'];

const formatGenreName = (genre: string) => {
    switch(genre) {
        case 'fantasy': return 'خيال';
        case 'sci-fi': return 'خيال علمي';
        case 'mystery': return 'غموض';
        case 'cyberpunk': return 'سايبربانك';
        case 'steampunk': return 'ستيمبنك';
        case 'saudi-folklore': return 'فولكلور سعودي';
        default:
            return genre
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
    }
};

export function TextAdventureApp() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [storyHistory, setStoryHistory] = useState<StoryPart[]>([]);
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  const [loading, setLoading] = useState<LoadingStates>({ story: false, vocab: false });
  const [error, setError] = useState<string | null>(null);
  const [gameGenre, setGameGenre] = useState<GameGenre>('fantasy');
  const [translation, setTranslation] = useState<TranslationState | null>(null);
  const { toast } = useToast();

  const handleAction = useCallback(async (action: TextAdventureAction, prompt?: string) => {
    setLoading(prev => ({ ...prev, story: true }));
    setError(null);
    setSelectedWord(null);

    let currentHistory = storyHistory;
    const isUserAction = action === 'continue' && prompt;
    if (isUserAction) {
        const userActionPart: StoryPart = {
          id: Date.now(),
          sender: 'user',
          text: prompt,
        };
        currentHistory = [...storyHistory, userActionPart];
        setStoryHistory(currentHistory);
    }
    
    if (action === 'start') {
        setStoryHistory([]);
        currentHistory = [];
    }

    try {
      const response = await textAdventureFlow({
        action,
        genre: gameGenre,
        playerInput: prompt,
        history: currentHistory
      });
      
      const aiResponsePart: StoryPart = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.narrative,
        vocabularyWord: response.newWord,
        suggestions: response.promptSuggestions,
        gameOver: response.gameOver,
      };

      setStoryHistory(prev => [...prev, aiResponsePart]);
      setGameState(response.gameOver ? 'gameOver' : 'playing');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Story Generation Error",
        description: errorMessage,
      });
      // Don't set game state to error, let the user see the message and retry
    } finally {
      setLoading(prev => ({ ...prev, story: false }));
    }
  }, [gameGenre, storyHistory, toast]);

  const handleWordClick = useCallback(async (word: string) => {
    if (!word) return;
    setLoading(prev => ({ ...prev, vocab: true }));
    setSelectedWord({ 
      word, 
      definition: 'Generating definition...', 
      imageUrl: '',
      arabicWord: 'جاري الترجمة...',
      arabicDefinition: 'جاري الترجمة...'
    });
    setError(null);

    try {
      const definitionResult = await defineWord({ word, genre: gameGenre });
      setSelectedWord(prev => prev ? { 
        ...prev, 
        definition: definitionResult.definition,
        arabicWord: definitionResult.arabicWord,
        arabicDefinition: definitionResult.arabicDefinition,
      } : null);

      const imageResult = await generateImageForWord({ word, definition: definitionResult.definition, genre: gameGenre });
      setSelectedWord(prev => prev ? { ...prev, imageUrl: imageResult.imageUrl } : null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get vocabulary details.';
      setError(errorMessage);
      setSelectedWord(prev => prev ? { ...prev, definition: 'Could not load details.', imageUrl: '' } : null);
    } finally {
      setLoading(prev => ({ ...prev, vocab: false }));
    }
  }, [gameGenre]);

  const handleNarrativeWordClick = useCallback(async (word: string) => {
    const cleanedWord = word.replace(/[^a-zA-Z]/g, '').trim();
    if (!cleanedWord) return;

    // Pronounce the word
    textToSpeech({prompt: cleanedWord, lang: 'en'}).catch(err => console.error("TTS error:", err));

    // Translate the word
    setTranslation({ word: word, text: 'جاري الترجمة...', isLoading: true });
    try {
        const result = await translateText({ text: cleanedWord, targetLanguage: 'ar' });
        setTranslation({ word: word, text: result.translation, isLoading: false });
    } catch (error) {
        console.error('Translation error:', error);
        setTranslation({ word: word, text: 'فشل الترجمة', isLoading: false });
        toast({ variant: 'destructive', title: 'خطأ في الترجمة' });
    }
  }, [toast]);
  
  const GameSetup = () => (
      <div className="flex-grow flex flex-col items-center justify-center text-center p-4 bg-gray-900 text-white">
         {gameState === 'gameOver' && <h2 className="text-4xl font-bold text-red-500 mb-4">انتهت اللعبة</h2>}
        <p className="text-lg text-gray-300 mb-6">{gameState === 'setup' ? 'اختر نوعًا وابدأ مهمتك.' : 'شكرا للعب!'}</p>
        <div className="mb-6 w-full max-w-xs">
            <label htmlFor="genre-select" className="block text-sm font-medium text-gray-400 mb-2">اختر النوع</label>
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
          onClick={() => handleAction('start')}
          disabled={loading.story}
          className="px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading.story ? (
             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (gameState === 'gameOver' ? 'العب مرة أخرى' : 'ابدأ المغامرة')}
        </button>
      </div>
  );


  return (
    <div className="flex h-full w-full bg-gray-900 font-sans">
      <main className="flex-1 flex flex-col p-4 md:p-6 h-full relative">
        {gameState === 'setup' || gameState === 'gameOver' ? (
          <GameSetup />
        ) : (
          <div className="flex-grow flex overflow-hidden h-full">
            <GamePanel 
              storyHistory={storyHistory} 
              onSendAction={(prompt) => handleAction('continue', prompt)} 
              onWordClick={handleWordClick}
              onNarrativeWordClick={handleNarrativeWordClick}
              loading={loading.story}
              error={error}
              translation={translation}
            />
          </div>
        )}
      </main>
      <aside className="w-[30%] max-w-md hidden lg:flex flex-col bg-gray-800/50 border-l border-gray-700 h-full">
        <VocabularyPanel selectedWord={selectedWord} loading={loading.vocab} />
      </aside>
    </div>
  );
}
