import React, { useState, useEffect, useRef } from 'react';
import type { StoryPart } from '../types';
import { UserIcon, WandSparklesIcon, SendIcon } from './IconComponents';

interface GamePanelProps {
  storyHistory: StoryPart[];
  onSendAction: (action: string) => void;
  onWordClick: (word: string) => void;
  loading: boolean;
  error: string | null;
}

const HighlightedText: React.FC<{ text: string; word: string; onClick: (word: string) => void }> = ({ text, word, onClick }) => {
    if (!word || !text.includes(word)) {
        return <>{text}</>;
    }
    const parts = text.split(new RegExp(`(${word})`, 'gi'));
    return (
        <>
            {parts.map((part, index) =>
                part.toLowerCase() === word.toLowerCase() ? (
                    <button
                        key={index}
                        onClick={() => onClick(word)}
                        className="font-bold text-purple-400 hover:text-purple-300 underline decoration-dotted underline-offset-4 cursor-pointer transition-colors"
                    >
                        {part}
                    </button>
                ) : (
                    <span key={index}>{part}</span>
                )
            )}
        </>
    );
};


export const GamePanel: React.FC<GamePanelProps> = ({ storyHistory, onSendAction, onWordClick, loading, error }) => {
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [storyHistory]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendAction(inputValue);
      setInputValue('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSendAction(suggestion);
    setInputValue('');
  };

  const lastAiPart = storyHistory.slice().reverse().find(p => p.sender === 'ai');

  return (
    <div className="flex flex-col w-full h-full max-h-full">
      <div ref={scrollRef} className="flex-grow overflow-y-auto pr-4 space-y-6">
        {storyHistory.map((part) => (
          <div key={part.id} className={`flex items-start gap-4 ${part.sender === 'user' ? 'justify-end' : ''}`}>
             {part.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex-shrink-0 flex items-center justify-center">
                <WandSparklesIcon className="w-5 h-5 text-purple-400" />
              </div>
            )}
            <div className={`p-4 rounded-xl max-w-xl ${part.sender === 'ai' ? 'bg-gray-800' : 'bg-blue-600/80'}`}>
              <p className="text-white whitespace-pre-wrap">
                {part.sender === 'ai' && part.vocabularyWord ? (
                   <HighlightedText text={part.text} word={part.vocabularyWord} onClick={onWordClick} />
                ) : (
                   part.text
                )}
              </p>
            </div>
            {part.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex-shrink-0 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-blue-400" />
                </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex-shrink-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
            </div>
            <div className="p-4 rounded-xl bg-gray-800 max-w-xl">
              <p className="text-gray-400 italic">The world pauses, awaiting your fate...</p>
            </div>
          </div>
        )}
         {error && (
            <div className="p-4 rounded-lg bg-red-900/50 border border-red-700 text-red-300">
                <strong>Error:</strong> {error}
            </div>
         )}
      </div>

      <div className="flex-shrink-0 pt-4 mt-auto">
        {lastAiPart && lastAiPart.suggestions && !loading && (
            <div className="flex flex-wrap gap-2 mb-3">
                {lastAiPart.suggestions.map((s, i) => (
                    <button key={i} onClick={() => handleSuggestionClick(s)} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-full text-sm transition-colors">
                        {s}
                    </button>
                ))}
            </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-gray-800 rounded-lg p-2 border border-gray-700 focus-within:border-purple-500">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What do you do next?"
            className="flex-grow bg-transparent text-white placeholder-gray-500 focus:outline-none px-2"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
