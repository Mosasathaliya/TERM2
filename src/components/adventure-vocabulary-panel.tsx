
import React from 'react';
import type { VocabularyWord } from '@/lib/adventure-game-types';
import { BookOpenIcon, ImageIcon, SparklesIcon } from '@/components/adventure-icon-components';
import { Volume2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { useToast } from "@/hooks/use-toast";
import { textToSpeech } from '@/ai/flows/tts-flow';

interface VocabularyPanelProps {
  selectedWord: VocabularyWord | null;
  loading: boolean;
}

export const VocabularyPanel: React.FC<VocabularyPanelProps> = ({ selectedWord, loading }) => {
  const { toast } = useToast();
  const [audioLoading, setAudioLoading] = React.useState<Record<string, boolean>>({});

  const handleSpeak = async (text: string, lang: 'en' | 'ar', id: string) => {
    if (!text || audioLoading[id]) return;

    setAudioLoading(prev => ({...prev, [id]: true}));
    try {
        const result = await textToSpeech({ text, language: lang });
        if (result && result.media) {
            const audio = new Audio(result.media);
            audio.play();
        } else {
            toast({
                title: "Text-to-Speech Error",
                description: "Could not generate audio.",
                variant: "destructive",
            });
        }
    } catch (error) {
        console.error("TTS Error:", error);
        toast({
            title: "TTS Error",
            description: "An unexpected error occurred.",
            variant: "destructive",
        });
    } finally {
        setAudioLoading(prev => ({...prev, [id]: false}));
    }
  };

  const renderContent = () => {
    if (loading && selectedWord) {
      return (
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
      );
    }
    
    if (selectedWord) {
      return (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-purple-400 capitalize">{selectedWord.word}</h3>
              <Button variant="ghost" size="icon" onClick={() => handleSpeak(selectedWord.word, 'en', 'en-word')} disabled={audioLoading['en-word']}><Volume2 className="h-5 w-5" /></Button>
            </div>
            {selectedWord.arabicWord && (
              <div className="flex items-center justify-between" dir="rtl">
                <h3 className="text-xl font-semibold text-cyan-400">{selectedWord.arabicWord}</h3>
                <Button variant="ghost" size="icon" onClick={() => handleSpeak(selectedWord.arabicWord!, 'ar', 'ar-word')} disabled={audioLoading['ar-word']}><Volume2 className="h-5 w-5" /></Button>
              </div>
            )}
          </div>
          
          <Separator className="bg-gray-600"/>

          <div>
             <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-200">Definition</h4>
                <Button variant="ghost" size="icon" onClick={() => handleSpeak(selectedWord.definition, 'en', 'en-def')} disabled={audioLoading['en-def']}><Volume2 className="h-5 w-5" /></Button>
              </div>
            <p className="text-gray-300 leading-relaxed">{selectedWord.definition}</p>
          </div>

          {selectedWord.arabicDefinition && (
            <div>
              <div className="flex items-center justify-between" dir="rtl">
                <h4 className="font-semibold text-gray-200">التعريف</h4>
                <Button variant="ghost" size="icon" onClick={() => handleSpeak(selectedWord.arabicDefinition!, 'ar', 'ar-def')} disabled={audioLoading['ar-def']}><Volume2 className="h-5 w-5" /></Button>
              </div>
              <p className="text-gray-300 leading-relaxed text-right" dir="rtl">{selectedWord.arabicDefinition}</p>
            </div>
          )}

          {selectedWord.imageUrl ? (
            <Image 
              src={selectedWord.imageUrl} 
              alt={`AI generated image for ${selectedWord.word}`}
              width={400}
              height={400}
              className="w-full h-auto object-cover rounded-lg border-2 border-gray-700 shadow-lg mt-4" 
            />
          ) : (
            <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center mt-4">
              <p className="text-gray-500">Image not available.</p>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <SparklesIcon className="w-16 h-16 mb-4" />
        <h3 className="font-semibold text-lg text-gray-400">Discover New Words</h3>
        <p>Click on a highlighted word in the story to see its AI-generated definition and artwork here.</p>
      </div>
    );
  };

  return (
    <div className="p-6 flex flex-col h-full text-gray-300">
      <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-3 mb-4 flex items-center gap-2">
        <BookOpenIcon className="w-6 h-6 text-purple-400" />
        Vocabulary
      </h2>
      <div className="flex-grow overflow-y-auto pr-2">
        {renderContent()}
      </div>
    </div>
  );
};
