
import React from 'react';
import type { VocabularyWord } from '@/lib/adventure-game-types';
import { BookOpenIcon, ImageIcon, SparklesIcon } from '@/components/adventure-icon-components';
import Image from 'next/image';

interface VocabularyPanelProps {
  selectedWord: VocabularyWord | null;
  loading: boolean;
}

export const VocabularyPanel: React.FC<VocabularyPanelProps> = ({ selectedWord, loading }) => {
  return (
    <div className="p-6 flex flex-col h-full text-gray-300">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-3 mb-4 flex items-center gap-2">
            <BookOpenIcon className="w-6 h-6 text-purple-400" />
            Vocabulary
        </h2>
        <div className="flex-grow overflow-y-auto pr-2">
            {loading && selectedWord ? (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold text-purple-400 capitalize mb-2">{selectedWord.word}</h3>
                        <p className="text-gray-400 italic">
                            {selectedWord.definition}
                        </p>
                    </div>
                     <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2 text-gray-500">
                            <ImageIcon className="w-10 h-10" />
                            <p className="text-sm">Conjuring image...</p>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
                        </div>
                    </div>
                </div>
            ) : selectedWord ? (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold text-purple-400 capitalize mb-2">{selectedWord.word}</h3>
                        <p className="text-gray-300 leading-relaxed">{selectedWord.definition}</p>
                    </div>
                    {selectedWord.imageUrl ? (
                        <Image 
                            src={selectedWord.imageUrl} 
                            alt={`AI generated image for ${selectedWord.word}`}
                            width={400}
                            height={400}
                            className="w-full h-auto object-cover rounded-lg border-2 border-gray-700 shadow-lg" 
                        />
                    ) : (
                         <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500">Image not available.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <SparklesIcon className="w-16 h-16 mb-4" />
                    <h3 className="font-semibold text-lg text-gray-400">Discover New Words</h3>
                    <p>Click on a highlighted word in the story to see its AI-generated definition and artwork here.</p>
                </div>
            )}
        </div>
    </div>
  );
};
