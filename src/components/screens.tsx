/**
 * @fileoverview Defines the content for each screen/tab of the application.
 */
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LearningItem, Lesson, Story } from '@/lib/lessons';
import { learningItems } from '@/lib/lessons';
import { LessonDetailDialog } from '@/components/lesson-detail-dialog';
import { chatStreamFlow } from '@/ai/flows/chat-flow';
import { useFlow } from '@genkit-ai/next/client';
import { useToast } from "@/hooks/use-toast"
import { BookText, Book, Bot } from 'lucide-react';
import Autoplay from "embla-carousel-autoplay"
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

export function HomeScreen() {
    const plugin = useRef(
      Autoplay({ delay: 3000, stopOnInteraction: true })
    )

  return (
    <section className="animate-fadeIn flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <h2 className="text-4xl font-bold mb-8 text-center">أهلاً بك في رحلتك لتعلم الإنجليزية</h2>
        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-xl"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            <CarouselItem>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <Image
                    src="https://placehold.co/600x400.png"
                    alt="Students in a classroom"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    data-ai-hint="classroom students"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem>
               <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <Image
                    src="https://placehold.co/600x400.png"
                    alt="A person studying English on a laptop"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    data-ai-hint="language study"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem>
               <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <Image
                    src="https://placehold.co/600x400.png"
                    alt="Global communication concept"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    data-ai-hint="global communication"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem>
               <Card className="overflow-hidden">
                <CardContent className="p-0">
                   <Image
                    src="https://placehold.co/600x400.png"
                    alt="People from different cultures talking"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    data-ai-hint="diverse conversation"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
             <CarouselItem>
               <Card className="overflow-hidden">
                <CardContent className="p-0">
                   <Image
                    src="https://placehold.co/600x400.png"
                    alt="Dictionary showing English to Arabic translation"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    data-ai-hint="dictionary translation"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
         <p className="text-muted-foreground mt-6 text-center max-w-2xl">
            استكشف الدروس التفاعلية، وتحدث مع مدرس الذكاء الاصطناعي، وتتبع تقدمك وأنت تتقن اللغة الإنجليزية.
        </p>
    </section>
  );
}

export function BookScreen() {
    const [selectedItem, setSelectedItem] = useState<LearningItem | null>(null);

    return (
        <section className="animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-center">المكتبة التعليمية</h2>
            <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {learningItems.map((item, i) => (
                        <Card 
                            key={i} 
                            className="transform transition-all hover:scale-[1.03] hover:shadow-lg bg-card/70 backdrop-blur-sm flex flex-col cursor-pointer"
                            onClick={() => setSelectedItem(item)}
                        >
                            <CardHeader className="flex-row items-center justify-center gap-4 space-y-0">
                                {item.type === 'lesson' ? (
                                    <Book className="h-6 w-6 text-primary" />
                                ) : (
                                    <BookText className="h-6 w-6 text-accent" />
                                )}
                                <CardTitle className="text-lg text-primary text-center">{item.title}</CardTitle>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
            {selectedItem && (
                <LessonDetailDialog 
                    item={selectedItem}
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </section>
    );
}


export function AiScreen() {
  const [input, setInput] = useState("");
  const { toast } = useToast();
  
  // Use the useFlow hook to interact with the streaming flow
  const { stream, start, abort, loading } = useFlow(chatStreamFlow, {
    // Handle errors from the flow
    onError(err) {
      console.error("AI chat error:", err);
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: "لم نتمكن من معالجة طلبك. الرجاء المحاولة مرة أخرى.",
      });
    },
  });

  const askAI = async () => {
    if (!input.trim() || loading) return;
    
    // Start the flow with the user's question
    start({ question: input });
    setInput("");
  };
  
  // Combine streamed chunks into a single response string
  const response = stream.map(s => s.output || '').join('');

  return (
    <section className="animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">اسأل الذكاء الاصطناعي</h2>
      <Card className="bg-card/70 backdrop-blur-sm">
        <CardContent className="pt-6">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب سؤالك هنا عن اللغة الإنجليزية..."
            rows={3}
            className="w-full p-3 rounded-md focus:ring-2 focus:ring-primary outline-none transition bg-background"
            disabled={loading}
             onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    askAI();
                }
            }}
          />
          <Button
            onClick={askAI}
            className="mt-3"
            disabled={loading || !input.trim()}
          >
            {loading ? '...جارٍ التفكير' : 'إرسال السؤال'}
          </Button>
        </CardContent>
      </Card>
      
      {(loading || response) && (
        <Card className="mt-4 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot />
              <span>إجابة الذكاء الاصطناعي</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{response}{loading && stream.length === 0 ? '...' : ''}</p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

export function ProgressScreen() {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prevProgress => (prevProgress >= 85 ? 13 : prevProgress + Math.random() * 15));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">تقدم التعلّم</h2>
      <Card className="bg-card/70 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span>التقدم العام</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="uppercase text-xs text-muted-foreground">الدروس المكتملة</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">14/80</p>
                </CardContent>
            </Card>
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="uppercase text-xs text-muted-foreground">القصص المقروءة</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">2/26</p>
                </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
