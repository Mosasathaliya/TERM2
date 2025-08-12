
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { textToSpeech } from "@/ai/flows/tts-flow";
import { useToast } from "@/hooks/use-toast";

export interface Word {
  english: string;
  arabic: string;
  definition: string;
  arabicDefinition: string;
  example: string;
  arabicExample: string;
}

interface WordCardProps {
  word: Word | null;
  isLoading?: boolean;
}

export function WordCard({ word, isLoading = false }: WordCardProps) {
  const { toast } = useToast();
  const [activeAudioId, setActiveAudioId] = React.useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const playBrowserArabic = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return false;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    window.speechSynthesis.speak(utterance);
    return true;
  };

  const handleSpeak = async (text: string, lang: 'en' | 'ar', id: string) => {
    if (!text || !text.trim()) {
      toast({ title: "No text to speak", description: "There is no content to convert to speech.", variant: "destructive" });
      return;
    }
    if (activeAudioId) return;
    if (audioRef.current) audioRef.current.pause();

    // Use browser TTS for Arabic only
    if (lang === 'ar') {
      const ok = playBrowserArabic(text);
      if (!ok) {
        toast({ title: "TTS غير مدعوم", description: "المتصفح لا يدعم تحويل النص إلى كلام بالعربية.", variant: "destructive" });
      }
      return;
    }

    setActiveAudioId(id);
    try {
      const result = await textToSpeech({ prompt: text, lang: 'en' });
      if (!result || !result.media) {
        toast({ title: "Text-to-Speech Error", description: "Could not generate audio for the selected text.", variant: "destructive" });
        setActiveAudioId(null);
        return;
      }

      const audio = new Audio(result.media);
      audioRef.current = audio;
      audio.play().catch(e => {
        console.error("Audio playback error:", e);
        toast({ title: "Audio Playback Error", description: "Your browser might be blocking audio. Tap and try again.", variant: "destructive" });
        setActiveAudioId(null);
      });
      audio.onended = () => setActiveAudioId(null);
      audio.onerror = () => {
        toast({ title: "Audio Error", description: "An error occurred while trying to play the audio.", variant: "destructive" });
        setActiveAudioId(null);
      };
    } catch (error) {
      console.error("TTS Error:", error);
      toast({ title: "Text-to-Speech Error", description: "An unexpected error occurred while generating audio.", variant: "destructive" });
      setActiveAudioId(null);
    }
  };

  React.useEffect(() => () => { if (audioRef.current) audioRef.current.pause(); }, []);

  if (isLoading) {
    return (
      <Card className="w-full max-w-md bg-card text-card-foreground shadow-lg rounded-lg transition-all duration-300 ease-in-out">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-8 w-3/5" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-6 w-2/5" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!word) return null;

  return (
    <Card className="w-full max-w-md bg-card text-card-foreground shadow-lg rounded-lg transition-all duration-300 ease-in-out">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{word.english}</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => handleSpeak(word.english, 'en', 'word-en')}>
          <Volume2 className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">الترجمة</span>
          <Button variant="ghost" size="icon" onClick={() => handleSpeak(word.arabic, 'ar', 'word-ar')}>
            <Volume2 className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-lg font-semibold">{word.arabic}</p>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">مثال</span>
          <Button variant="ghost" size="icon" onClick={() => handleSpeak(word.example, 'en', 'ex-en')}>
            <Volume2 className="h-5 w-5" />
          </Button>
        </div>
        <p>{word.example}</p>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">مثال بالعربية</span>
          <Button variant="ghost" size="icon" onClick={() => handleSpeak(word.arabicExample, 'ar', 'ex-ar')}>
            <Volume2 className="h-5 w-5" />
          </Button>
        </div>
        <p dir="rtl">{word.arabicExample}</p>
      </CardContent>
    </Card>
  );
}
