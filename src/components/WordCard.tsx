
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
  const [audioLoading, setAudioLoading] = React.useState<Record<string, boolean>>({});

  const handleSpeak = async (text: string, id: string) => {
    if (audioLoading[id]) return;

    setAudioLoading(prev => ({...prev, [id]: true}));
    try {
        const result = await textToSpeech({text, voice: 'algenib'});
        if (result && result.media) {
            const audio = new Audio(result.media);
            audio.play();
        } else {
            toast({
                title: "Text-to-Speech Error",
                description: "Could not generate audio for the selected text.",
                variant: "destructive",
            });
        }
    } catch (error) {
        console.error("TTS Error:", error);
        toast({
            title: "Text-to-Speech Error",
            description: "An unexpected error occurred while generating audio.",
            variant: "destructive",
        });
    } finally {
        setAudioLoading(prev => ({...prev, [id]: false}));
    }
  };


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

  if (!word) {
    return (
       <Card className="w-full max-w-md bg-card text-card-foreground shadow-lg rounded-lg transition-all duration-300 ease-in-out p-6">
         <p className="text-center text-muted-foreground">Select a category and click "Next Word" to begin.</p>
       </Card>
     );
   }


  return (
    <Card className="w-full max-w-md bg-card text-card-foreground shadow-lg rounded-lg fade-in transition-all duration-300 ease-in-out">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-3xl font-bold text-primary truncate">
          {word.english}
        </CardTitle>
        <Button
            variant="ghost"
            size="icon"
            onClick={() => handleSpeak(word.english, 'word')}
            aria-label={`Listen to ${word.english}`}
            title="Listen to pronunciation"
            className="text-primary hover:text-primary/80"
            disabled={audioLoading['word']}
        >
            <Volume2 className={`h-6 w-6 ${audioLoading['word'] ? 'animate-pulse' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="bg-muted/30 p-3 rounded-md">
          <h3 className="text-sm font-medium text-accent mb-1">🌍 Arabic Meaning:</h3>
          <p className="text-xl font-semibold text-right font-[inherit]" dir="rtl">
            {word.arabic}
          </p>
        </div>

        <Separator />

        <div className="space-y-3">
           <div>
             <h3 className="text-sm font-medium text-accent mb-1 flex items-center gap-1">
               📖 Definition (EN)
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSpeak(word.definition, 'definition')}
                    aria-label="Listen to English definition"
                    title="Listen to definition"
                    className="text-primary hover:text-primary/80 h-5 w-5 p-0"
                    disabled={audioLoading['definition']}
                >
                    <Volume2 className={`h-4 w-4 ${audioLoading['definition'] ? 'animate-pulse' : ''}`} />
                </Button>
             </h3>
             <p className="text-base leading-relaxed">{word.definition}</p>
           </div>
           <div>
             <h3 className="text-sm font-medium text-accent mb-1 flex items-center gap-1">
               💬 Example (EN)
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSpeak(word.example, 'example')}
                    aria-label="Listen to English example sentence"
                    title="Listen to example"
                    className="text-primary hover:text-primary/80 h-5 w-5 p-0"
                    disabled={audioLoading['example']}
                >
                    <Volume2 className={`h-4 w-4 ${audioLoading['example'] ? 'animate-pulse' : ''}`} />
                </Button>
             </h3>
             <p className="text-base italic text-foreground/80">"{word.example}"</p>
           </div>
        </div>

        <Separator />

         <div className="space-y-3 text-right" dir="rtl">
           <div>
             <h3 className="text-sm font-medium text-accent mb-1 flex items-center justify-end gap-1">
               📖 التعريف (AR)
             </h3>
             <p className="text-base leading-relaxed font-[inherit]">{word.arabicDefinition}</p>
           </div>
           <div>
             <h3 className="text-sm font-medium text-accent mb-1 flex items-center justify-end gap-1">
                💬 مثال (AR)
             </h3>
             <p className="text-base italic text-foreground/80 font-[inherit]">"{word.arabicExample}"</p>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
