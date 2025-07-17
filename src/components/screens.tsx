
/**
 * @fileoverview Defines the content for each screen/tab of the application.
 */
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LearningItem, Lesson, Story } from '@/lib/lessons';
import { learningItems } from '@/lib/lessons';
import { LessonDetailDialog } from '@/components/lesson-detail-dialog';
import { chatStream } from '@/ai/flows/chat-flow';
import { useToast } from "@/hooks/use-toast"
import { BookText, Book, Bot, ArrowRight, ArrowLeft, Sparkles, Image as ImageIcon, GraduationCap, Mic, X, Gamepad2, MessageCircle, Flame, Puzzle, Ear, BookCheck } from 'lucide-react';
import Image from 'next/image';
import type { ActiveTab } from './main-app';
import { generateStoryImage } from '@/ai/flows/story-image-flow';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { LingoleapApp } from './lingoleap-app';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { TextAdventureApp } from './text-adventure-app';
import { MumbleJumbleApp } from './mumble-jumble-app';
import { TenseTeacherApp } from './tense-teacher-app';
import { ChatterbotApp } from './chatterbot-app';
import { DialogDescription } from './ui/dialog';


export function HomeScreen({ setActiveTab }: { setActiveTab: (tab: ActiveTab) => void }) {
    const [isLingoleapOpen, setIsLingoleapOpen] = useState(false);
    const [isAdventureOpen, setIsAdventureOpen] = useState(false);
    const [isJumbleGameOpen, setIsJumbleGameOpen] = useState(false);
    const [isTenseTeacherOpen, setIsTenseTeacherOpen] = useState(false);
    
  return (
    <>
    <section className="animate-fadeIn">
        <h2 className="text-4xl font-bold mb-4 text-center">أهلاً بك في رحلتك لتعلم الإنجليزية</h2>
         <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            استكشف الدروس التفاعلية، وتحدث مع مدرس الذكاء الاصطناعي، وتتبع تقدمك وأنت تتقن اللغة الإنجليزية.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card 
                className="cursor-pointer transform transition-all hover:scale-[1.03] hover:shadow-lg bg-card/70 backdrop-blur-sm"
                onClick={() => setIsLingoleapOpen(true)}
            >
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <GraduationCap className="h-8 w-8 text-primary" />
                        <span>مُنشئ المفردات</span>
                    </CardTitle>
                    <CardDescription>
                        قم بتوسيع مفرداتك مع كلمات وتعريفات وأمثلة مولدة بالذكاء الاصطناعي.
                    </CardDescription>
                </CardHeader>
            </Card>

            <Card 
                className="cursor-pointer transform transition-all hover:scale-[1.03] hover:shadow-lg bg-card/70 backdrop-blur-sm"
                 onClick={() => setIsAdventureOpen(true)}
            >
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Gamepad2 className="h-8 w-8 text-accent" />
                        <span>مغامرة جيمني</span>
                    </CardTitle>
                    <CardDescription>
                        العب لعبة مغامرة نصية لتعلم المفردات في سياقها.
                    </CardDescription>
                </CardHeader>
            </Card>
            
            <Card 
                className="cursor-pointer transform transition-all hover:scale-[1.03] hover:shadow-lg bg-card/70 backdrop-blur-sm"
                onClick={() => setIsTenseTeacherOpen(true)}
            >
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <BookCheck className="h-8 w-8 text-destructive" />
                        <span>خبير الأزمنة</span>
                    </CardTitle>
                    <CardDescription>
                        تحدث مع خبير الذكاء الاصطناعي لإتقان أزمنة اللغة الإنجليزية.
                    </CardDescription>
                </CardHeader>
            </Card>
            
            <Card 
                className="cursor-pointer transform transition-all hover:scale-[1.03] hover:shadow-lg bg-card/70 backdrop-blur-sm md:col-span-2 lg:col-span-3"
                onClick={() => setIsJumbleGameOpen(true)}
            >
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Puzzle className="h-8 w-8 text-secondary" />
                        <span>لعبة الكلمات المبعثرة</span>
                    </CardTitle>
                    <CardDescription>
                        أعد ترتيب الحروف لتكوين كلمات وحسّن مهاراتك الإملائية.
                    </CardDescription>
                </CardHeader>
            </Card>

        </div>
        
    </section>

    <Dialog open={isLingoleapOpen} onOpenChange={setIsLingoleapOpen}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
             <DialogHeader className="p-4 border-b">
                <DialogTitle>LinguaLeap Vocabulary Builder</DialogTitle>
                <DialogDescription className="sr-only">An AI-powered tool to expand your vocabulary.</DialogDescription>
                 <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>
            </DialogHeader>
            <div className="flex-grow min-h-0">
                <LingoleapApp />
            </div>
        </DialogContent>
    </Dialog>

     <Dialog open={isAdventureOpen} onOpenChange={setIsAdventureOpen}>
        <DialogContent className="max-w-full w-full h-screen max-h-screen p-0 m-0 rounded-none border-0">
             <DialogHeader className="p-4 border-b absolute top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-10">
                <DialogTitle>Gemini Text Adventure</DialogTitle>
                 <DialogDescription className="sr-only">An interactive text adventure game to learn vocabulary.</DialogDescription>
                 <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>
            </DialogHeader>
            <div className="flex-grow h-full pt-[65px]">
                <TextAdventureApp />
            </div>
        </DialogContent>
    </Dialog>

     <Dialog open={isJumbleGameOpen} onOpenChange={setIsJumbleGameOpen}>
        <DialogContent className="max-w-full w-full h-screen max-h-screen p-0 m-0 rounded-none border-0">
             <DialogHeader className="p-4 border-b absolute top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-10">
                <DialogTitle>Jumble Game</DialogTitle>
                <DialogDescription className="sr-only">A game to unscramble letters and improve spelling.</DialogDescription>
                 <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>
            </DialogHeader>
            <div className="flex-grow h-full pt-[65px]">
                <MumbleJumbleApp />
            </div>
        </DialogContent>
    </Dialog>

     <Dialog open={isTenseTeacherOpen} onOpenChange={setIsTenseTeacherOpen}>
        <DialogContent className="w-full max-w-4xl h-[90vh] flex flex-col p-0">
             <DialogHeader className="p-4 border-b shrink-0">
                <DialogTitle>Tense Teacher</DialogTitle>
                <DialogDescription>A voice-based AI expert to help you master English tenses.</DialogDescription>
                 <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>
            </DialogHeader>
            <TenseTeacherApp />
        </DialogContent>
    </Dialog>
    </>
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


interface AiScreenProps {
  setActiveTab: (tab: ActiveTab) => void;
}

function AiChat() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const askAI = async () => {
    if (!input.trim() || loading) return;
    
    setLoading(true);
    setResponse(""); // Clear previous response
    const currentInput = input;
    setInput("");

    try {
      const stream = await chatStream(currentInput);
      if (!stream) {
        throw new Error("Server action did not return a stream.");
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const decodedChunk = decoder.decode(value, { stream: true });
        setResponse(prev => prev + decodedChunk);
      }
    } catch (err) {
      console.error("AI chat error:", err);
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: "لم نتمكن من معالجة طلبك. الرجاء المحاولة مرة أخرى.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
      <div className="flex flex-col h-full">
          <DialogHeader className="p-4 border-b">
              <DialogTitle>اسأل الذكاء الاصطناعي</DialogTitle>
              <DialogDescription>Your general-purpose English learning assistant.</DialogDescription>
          </DialogHeader>
          <CardContent className="flex-grow flex flex-col gap-4 pt-4">
              <div className="flex-grow rounded-lg border bg-muted/50 p-4 space-y-2 overflow-y-auto">
                 {response ? (
                    <p className="whitespace-pre-wrap">{response}</p>
                 ) : (
                    <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                        <Bot className="h-10 w-10 mb-2"/>
                        <p>جاهز للإجابة على أسئلتك</p>
                    </div>
                 )}
                 {loading && !response && <span>...جارٍ التفكير</span>}
              </div>
              <div className="flex gap-2">
                 <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="اكتب سؤالك هنا..."
                    rows={1}
                    className="w-full p-2 rounded-md focus:ring-2 focus:ring-primary outline-none transition resize-none bg-background"
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
                    disabled={loading || !input.trim()}
                    >
                    {loading ? '...' : 'إرسال'}
                </Button>
              </div>
          </CardContent>
      </div>
  );
}

function AiStoryMaker() {
    const [prompt, setPrompt] = useState("");
    const [story, setStory] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const generateStory = async () => {
        if (!prompt.trim() || loading) return;

        setLoading(true);
        setStory("");
        setImageUrl(null);

        try {
            const storyStream = await chatStream(`Write a short, creative story in English about: ${prompt}`);
            if (!storyStream) throw new Error("Could not get story stream.");

            const reader = storyStream.getReader();
            const decoder = new TextDecoder();
            let fullStory = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const decodedChunk = decoder.decode(value, { stream: true });
                setStory(prev => prev + decodedChunk);
                fullStory += decodedChunk;
            }

            const imageResult = await generateStoryImage({ story: fullStory });
            setImageUrl(imageResult.imageUrl);

        } catch (err) {
            console.error("AI story generation error:", err);
            toast({
                variant: "destructive",
                title: "حدث خطأ",
                description: "لم نتمكن من إنشاء القصة. الرجاء المحاولة مرة أخرى.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <DialogHeader className="p-4 border-b shrink-0">
                <DialogTitle>مولد قصص الذكاء الاصطناعي</DialogTitle>
                <DialogDescription>Turn your ideas into illustrated stories.</DialogDescription>
                <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>
            </DialogHeader>
            <div className="p-4 flex flex-col gap-4 shrink-0">
                 <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="اكتب فكرة لقصة، مثل 'رائد فضاء يجد حديقة على المريخ'..."
                    rows={2}
                    className="w-full p-3 rounded-md focus:ring-2 focus:ring-primary outline-none transition bg-background"
                    disabled={loading}
                />
                <Button onClick={generateStory} disabled={loading || !prompt.trim()}>
                    {loading ? '...جاري الكتابة' : <><Sparkles className="mr-2 h-4 w-4"/> إنشاء قصة</>}
                </Button>
            </div>
            <div className="flex-grow p-4 pt-0 min-h-0">
                 {(loading || story) && (
                    <ScrollArea className="h-full rounded-lg border bg-muted/50 p-4">
                        {imageUrl && (
                             <div className="mb-4 border rounded-lg overflow-hidden">
                                <Image
                                    src={imageUrl}
                                    alt={`Illustration for the story`}
                                    width={500}
                                    height={300}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        )}
                        {loading && !imageUrl && (
                            <div className="flex items-center justify-center p-4 rounded-md bg-muted mb-4">
                                <ImageIcon className="h-6 w-6 text-muted-foreground animate-pulse" />
                                <span className="text-muted-foreground mr-2">...يتم إنشاء الصورة</span>
                            </div>
                        )}
                        <p className="whitespace-pre-wrap" dir="ltr">{story}{loading && story.length === 0 ? '...' : ''}</p>
                    </ScrollArea>
                )}
            </div>
        </div>
    );
}

export function AiScreen({ setActiveTab }: AiScreenProps) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isStoryMakerOpen, setIsStoryMakerOpen] = useState(false);
    const [isVoiceChatOpen, setIsVoiceChatOpen] = useState(false);

    return (
        <section className="animate-fadeIn">
            <h2 className="text-3xl font-bold mb-2 text-center">أدوات الذكاء الاصطناعي</h2>
            <p className="text-muted-foreground mb-6 text-center">اختر أداة لمساعدتك في رحلة تعلم اللغة.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card 
                    className="cursor-pointer transform transition-all hover:scale-[1.03] hover:shadow-lg bg-card/70 backdrop-blur-sm"
                    onClick={() => setIsChatOpen(true)}
                >
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <MessageCircle className="h-8 w-8 text-primary" />
                            <span>دردشة الذكاء الاصطناعي</span>
                        </CardTitle>
                        <CardDescription>
                            اطرح أسئلة عامة عن اللغة الإنجليزية واحصل على إجابات فورية.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card 
                    className="cursor-pointer transform transition-all hover:scale-[1.03] hover:shadow-lg bg-card/70 backdrop-blur-sm"
                    onClick={() => setIsStoryMakerOpen(true)}
                >
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <Sparkles className="h-8 w-8 text-accent" />
                            <span>صانع القصص</span>
                        </CardTitle>
                        <CardDescription>
                            حوّل أفكارك إلى قصص قصيرة مصورة باللغة الإنجليزية.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card 
                    className="cursor-pointer transform transition-all hover:scale-[1.03] hover:shadow-lg bg-card/70 backdrop-blur-sm"
                    onClick={() => setIsVoiceChatOpen(true)}
                >
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <Ear className="h-8 w-8 text-destructive" />
                            <span>المساعد الصوتي</span>
                        </CardTitle>
                        <CardDescription>
                            تدرب على المحادثة مع مساعد صوتي يعمل بالذكاء الاصطناعي.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>

            {/* AI Chat Dialog */}
            <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
                <DialogContent className="max-w-2xl h-[70vh] flex flex-col p-0">
                    <AiChat />
                </DialogContent>
            </Dialog>

            {/* Story Maker Dialog */}
            <Dialog open={isStoryMakerOpen} onOpenChange={setIsStoryMakerOpen}>
                <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0">
                   <AiStoryMaker />
                </DialogContent>
            </Dialog>

             {/* Voice Chat Dialog */}
            <Dialog open={isVoiceChatOpen} onOpenChange={setIsVoiceChatOpen}>
                <DialogContent className="max-w-full w-full h-screen max-h-screen p-0 m-0 rounded-none border-0">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Voice Assistant</DialogTitle>
                        <DialogDescription>Practice conversation with a voice-based AI assistant.</DialogDescription>
                    </DialogHeader>
                    <ChatterbotApp />
                     <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary z-20 text-white">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </section>
    );
}

const chartData = [
  { day: "الأحد", lessons: 2 },
  { day: "الاثنين", lessons: 3 },
  { day: "الثلاثاء", lessons: 1 },
  { day: "الأربعاء", lessons: 4 },
  { day: "الخميس", lessons: 3 },
  { day: "الجمعة", lessons: 1 },
  { day: "السبت", lessons: 5 },
];

const chartConfig: ChartConfig = {
  lessons: {
    label: "الدروس",
    color: "hsl(var(--primary))",
  },
};

export function ProgressScreen() {
  return (
    <section className="animate-fadeIn space-y-6">
      <Card className="bg-card/70 backdrop-blur-sm">
        <CardContent className="pt-6 flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage data-ai-hint="profile person" src="https://placehold.co/128x128.png" alt="User Avatar" />
            <AvatarFallback>ط</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <h2 className="text-xl font-bold">طالب مجتهد</h2>
            <p className="text-muted-foreground">متعلم متحمس</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-accent flex items-center gap-1">
              <Flame /> 12
            </p>
            <p className="text-xs text-muted-foreground">أيام متتالية</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="bg-card/70 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="uppercase text-xs text-muted-foreground">الدروس المكتملة</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">14 / 80</p>
                <Progress value={(14/80) * 100} className="h-2 mt-2" />
            </CardContent>
        </Card>
        <Card className="bg-card/70 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="uppercase text-xs text-muted-foreground">القصص المقروءة</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">5 / 26</p>
                <Progress value={(5/26) * 100} className="h-2 mt-2" />
            </CardContent>
        </Card>
      </div>

      <Card className="bg-card/70 backdrop-blur-sm">
        <CardHeader>
            <CardTitle>نشاط التعلم الأسبوعي</CardTitle>
            <CardDescription>الدروس المكتملة في الأيام السبعة الماضية</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="lessons" fill="var(--color-lessons)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  );
}
