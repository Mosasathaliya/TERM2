
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
  const [activeAudioId, setActiveAudioId] = React.useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const handleSpeak = async (text: string, lang: 'en' | 'ar', id: string) => {
    if (activeAudioId || !text) return;

    if (lang === 'ar' && typeof window !== 'undefined' && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ar-SA';
      window.speechSynthesis.speak(u);
      return;
    }

    if (audioRef.current) audioRef.current.pause();

    setActiveAudioId(id);
    try {
      const result = await textToSpeech({ prompt: text, lang: 'en' });
      if (result && result.media) {
        const audio = new Audio(result.media);
        audioRef.current = audio;

        audio.play().catch(e => {
          console.error("Audio playback error:", e);
          toast({ title: "Audio Playback Error", variant: "destructive" });
          setActiveAudioId(null);
        });
        
        audio.onended = () => setActiveAudioId(null);
        audio.onerror = () => {
          toast({ title: "Audio Error", variant: "destructive" });
          setActiveAudioId(null);
        };
      } else {
        toast({ title: "TTS Error", description: "Could not generate audio.", variant: "destructive" });
        setActiveAudioId(null);
      }
    } catch (error) {
      console.error("TTS Error:", error);
      toast({ title: "TTS Error", description: "An unexpected error occurred.", variant: "destructive" });
      setActiveAudioId(null);
    }
  };

  React.useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

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
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-purple-400 capitalize">{selectedWord.word}</h3>
            <Button variant="ghost" size="icon" onClick={() => handleSpeak(selectedWord.word, 'en', 'word-en')}>
              <Volume2 className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-gray-300">{selectedWord.definition}</p>

          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-gray-400">الكلمة بالعربية</span>
            <Button variant="ghost" size="icon" onClick={() => handleSpeak(selectedWord.arabicWord, 'ar', 'word-ar')}>
              <Volume2 className="w-5 h-5" />
            </Button>
          </div>
          <p dir="rtl" className="text-gray-200">{selectedWord.arabicWord}</p>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">الشرح بالعربية</span>
            <Button variant="ghost" size="icon" onClick={() => handleSpeak(selectedWord.arabicDefinition, 'ar', 'def-ar')}>
              <Volume2 className="w-5 h-5" />
            </Button>
          </div>
          <p dir="rtl" className="text-gray-200">{selectedWord.arabicDefinition}</p>
        </div>
      );
    }

    return (
      <div className="text-gray-400 text-sm">
        اختر كلمة من القصة لاستكشاف معناها وصورتها.
      </div>
    );
  };

  return (
    <aside className="w-80 bg-gray-800 p-4 border-l border-gray-700 overflow-y-auto hidden md:block">
      <div className="flex items-center gap-2 mb-4 text-gray-300">
        <BookOpenIcon className="w-5 h-5" />
        <h2 className="text-lg font-semibold">مفردات القصة</h2>
      </div>
      {renderContent()}
    </aside>
  );
};

    