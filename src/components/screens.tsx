
/**
 * @fileoverview Defines the content for each screen/tab of the application.
 */
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LearningItem, Story } from '@/lib/lessons';
import { learningItems } from '@/lib/lessons';
import { LessonDetailDialog } from '@/components/lesson-detail-dialog';
import { chatStream } from '@/ai/flows/chat-flow';
import { useToast } from "@/hooks/use-toast"
import { BookText, Book, Bot, ArrowRight, Sparkles, Image as ImageIcon, GraduationCap, Mic, X, Gamepad2, MessageCircle, Flame, Puzzle, Ear, BookCheck, Library, Loader2, Youtube, PlayCircle, Brain, ChevronLeft, ChevronRight, LightbulbIcon, Volume2 } from 'lucide-react';
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
import { DialogDescription, DialogFooter } from './ui/dialog';
import { lessons } from '@/data/lingo-lessons-data';
import type { Lesson } from '@/types/lesson';
import LessonDisplay from './lesson/LessonDisplay';
import { generateLessonContent } from '@/ai/flows/generate-lesson-content';
import Link from 'next/link';

// Import video links from the data files
import videoLinks from '@/data/video-links';
import whatIfLinks from '@/data/whatif-links';
import { explainVideoTopic, type ExplainVideoOutput } from '@/ai/flows/explain-video-flow';
import { textToSpeech } from '@/ai/flows/tts-flow';


// Helper function to extract YouTube embed URL and video ID
const getYouTubeInfo = (url: string): { embedUrl: string | null; videoId: string | null; title: string | null } => {
    let videoId = null;
    let title = null; // We can't get the title from the URL alone easily, but can pass it if available.
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.slice(1);
        } else if (urlObj.hostname === 'youtube.com' || urlObj.hostname === 'www.youtube.com') {
             if (urlObj.pathname.startsWith('/live/')) {
                videoId = urlObj.pathname.split('/live/')[1].split('?')[0];
            } else {
                videoId = urlObj.searchParams.get('v');
            }
        }
    } catch (e) {
        console.error("Invalid URL format:", url, e);
        return { embedUrl: null, videoId: null, title: null };
    }

    if (videoId) {
        // A real implementation would fetch the title from the YouTube API
        // For now, we can create a placeholder title
        title = `What If Video: ${videoId}`;
        return { embedUrl: `https://www.youtube.com/embed/${videoId}`, videoId, title };
    }
    return { embedUrl: null, videoId: null, title: null };
};

function LessonList() {
  return (
    <ScrollArea className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {lessons.map((lesson) => {
          let displayExplanation: string;
          if (typeof lesson.arabic_explanation === 'string' && lesson.arabic_explanation.length > 0) {
            displayExplanation = lesson.arabic_explanation;
            if (displayExplanation.length > 150) {
              displayExplanation = displayExplanation.substring(0, 147) + "...";
            }
          } else {
            displayExplanation = `Tap to learn about ${lesson.topic}. AI will generate the details.`;
          }

          return (
            <Link href={`/lessons/${lesson.lesson_id}`} key={lesson.lesson_id} passHref>
              <Card className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {lesson.title}
                      </CardTitle>
                      {lesson.title_arabic && (
                        <CardTitle
                          className="text-lg text-muted-foreground mt-1 group-hover:text-primary/80 transition-colors"
                          dir="rtl"
                        >
                          {lesson.title_arabic}
                        </CardTitle>
                      )}
                    </div>
                  </div>
                  <CardDescription className="text-sm text-muted-foreground">
                    {lesson.topic}
                    {lesson.topic_arabic && (
                      <span className="block mt-0.5" dir="rtl">{lesson.topic_arabic}</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-foreground/80 line-clamp-3">
                    {displayExplanation}
                  </p>
                </CardContent>
                <CardFooter className="mt-auto pt-4">
                  <div className="flex items-center text-sm text-primary font-semibold group-hover:underline">
                    ابدأ الدرس
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </ScrollArea>
  );
}

function VideoPlayerModal({ videoUrl, onClose }: { videoUrl: string | null; onClose: () => void }) {
    if (!videoUrl) return null;
  
    return (
      <Dialog open={!!videoUrl} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-4xl h-[70vh] p-0 border-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Video Player</DialogTitle>
            <DialogDescription>Playing selected educational video.</DialogDescription>
          </DialogHeader>
          <iframe
            width="100%"
            height="100%"
            src={`${videoUrl}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </DialogContent>
      </Dialog>
    );
  }

function VideoLearnDialog({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
    const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

    const videoData = videoLinks.split('\n').map(getYouTubeInfo).filter(item => item.embedUrl);

    return (
      <>
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-4 border-b shrink-0">
                    <DialogTitle>تعلم بالفيديو</DialogTitle>
                    <DialogDescription>شاهد هذه الفيديوهات التعليمية لتعزيز تعلمك.</DialogDescription>
                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogHeader>
                <ScrollArea className="flex-grow min-h-0">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videoData.map((video, index) => (
                            <div 
                                key={index} 
                                className="aspect-video bg-muted rounded-lg overflow-hidden shadow-lg group cursor-pointer relative"
                                onClick={() => setSelectedVideoUrl(video.embedUrl)}
                            >
                                <Image
                                    src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                                    alt={`Video thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-110"
                                    data-ai-hint="video thumbnail"
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <PlayCircle className="h-16 w-16 text-white/70 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>

        <VideoPlayerModal videoUrl={selectedVideoUrl} onClose={() => setSelectedVideoUrl(null)} />
      </>
    );
}

function ExplanationDialog({ videoTitle, isOpen, onOpenChange }: { videoTitle: string; isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
  const [explanation, setExplanation] = useState<ExplainVideoOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [audioLoading, setAudioLoading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && videoTitle) {
      setIsLoading(true);
      setExplanation(null);
      explainVideoTopic({ videoTitle })
        .then(setExplanation)
        .catch(err => {
          console.error("Failed to get explanation:", err);
          toast({ variant: 'destructive', title: 'خطأ', description: 'لم نتمكن من الحصول على شرح للفيديو.' });
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, videoTitle, toast]);

  const handlePlayAudio = async (text: string, id: string) => {
    if (!text || audioLoading === id) return;
    setAudioLoading(id);
    try {
      const result = await textToSpeech({ text, voice: 'achernar' });
      if (result?.media) {
        new Audio(result.media).play();
      }
    } catch (err) {
      console.error("TTS Error:", err);
      toast({ variant: 'destructive', title: 'خطأ في الصوت' });
    } finally {
      setAudioLoading(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>شرح الفيديو: {videoTitle}</DialogTitle>
          <DialogDescription>
            فيما يلي تفصيل للموضوعات الرئيسية التي تمت مناقشتها في الفيديو.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto" dir="rtl">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : explanation ? (
            <div className="space-y-6">
              <ExplanationSection title="ملخص" content={explanation.summary} onPlay={() => handlePlayAudio(explanation.summary, 'summary')} isLoading={audioLoading === 'summary'} />
              <ExplanationSection title="المفاهيم الرئيسية" content={explanation.keyConcepts} onPlay={() => handlePlayAudio(explanation.keyConcepts, 'concepts')} isLoading={audioLoading === 'concepts'}/>
              <ExplanationSection title="تشبيه/مقارنة بسيطة" content={explanation.analogy} onPlay={() => handlePlayAudio(explanation.analogy, 'analogy')} isLoading={audioLoading === 'analogy'}/>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">تعذر تحميل الشرح.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const ExplanationSection = ({ title, content, onPlay, isLoading }: { title: string, content: string, onPlay: () => void, isLoading: boolean }) => (
  <div className="p-4 bg-muted/50 rounded-lg">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      <Button variant="ghost" size="icon" onClick={onPlay} disabled={isLoading}>
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Volume2 className="h-5 w-5" />}
      </Button>
    </div>
    <p className="text-foreground/90 whitespace-pre-wrap">{content}</p>
  </div>
);


function WhatIfDialog({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isExplanationOpen, setIsExplanationOpen] = useState(false);

    const videoData = whatIfLinks.split('\n').map(getYouTubeInfo).filter(item => item.embedUrl);
    const currentVideo = videoData[currentIndex];

    const goToNext = () => setCurrentIndex(prev => (prev + 1) % videoData.length);
    const goToPrevious = () => setCurrentIndex(prev => (prev - 1 + videoData.length) % videoData.length);
    
    return (
      <>
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-auto flex flex-col p-4 sm:p-6 gap-4">
                <DialogHeader>
                    <DialogTitle>ماذا لو...؟</DialogTitle>
                    <DialogDescription>استكشف سيناريوهات افتراضية رائعة. فيديو {currentIndex + 1} من {videoData.length}.</DialogDescription>
                </DialogHeader>
                <div className="flex-grow aspect-video bg-muted rounded-lg overflow-hidden shadow-inner">
                    {currentVideo?.embedUrl && (
                        <iframe
                            key={currentVideo.embedUrl} // Add key to force re-render
                            width="100%"
                            height="100%"
                            src={`${currentVideo.embedUrl}?autoplay=1`}
                            title="What If YouTube Video Player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    )}
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2 justify-between w-full">
                    <Button onClick={goToPrevious} disabled={videoData.length <= 1}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        السابق
                    </Button>
                     <Button variant="secondary" onClick={() => setIsExplanationOpen(true)}>
                        <LightbulbIcon className="mr-2 h-4 w-4" />
                        اشرح هذا الفيديو
                    </Button>
                    <Button onClick={goToNext} disabled={videoData.length <= 1}>
                        التالي
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        {currentVideo && (
           <ExplanationDialog 
              videoTitle={currentVideo.title || `Video ${currentIndex + 1}`}
              isOpen={isExplanationOpen} 
              onOpenChange={setIsExplanationOpen}
            />
        )}
      </>
    );
}

export function HomeScreen({ setActiveTab }: { setActiveTab: (tab: ActiveTab) => void }) {
    const [isLingoleapOpen, setIsLingoleapOpen] = useState(false);
    const [isAdventureOpen, setIsAdventureOpen] = useState(false);
    const [isJumbleGameOpen, setIsJumbleGameOpen] = useState(false);
    const [isTenseTeacherOpen, setIsTenseTeacherOpen] = useState(false);
    const [isLessonsOpen, setIsLessonsOpen] = useState(false);
    const [isVideoLearnOpen, setIsVideoLearnOpen] = useState(false);
    const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);
    
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
                className="cursor-pointer transform transition-all hover:scale-[1.03] hover:shadow-lg bg-card/70 backdrop-blur-sm"
                onClick={() => setIsLessonsOpen(true)}
            >
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Library className="h-8 w-8 text-green-500" />
                        <span>مواد تعليمية إضافية</span>
                    </CardTitle>
                    <CardDescription>
                        تصفح مكتبة الدروس المنظمة حسب المستوى والموضوع.
                    </CardDescription>
                </CardHeader>
            </Card>
            
            <Card 
                className="cursor-pointer transform transition-all hover:scale-[1.03] hover:shadow-lg bg-card/70 backdrop-blur-sm"
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
            
            <Card 
                className="cursor-pointer transform transition-all hover:scale-[1.03] hover:shadow-lg bg-card/70 backdrop-blur-sm"
                onClick={() => setIsVideoLearnOpen(true)}
            >
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Youtube className="h-8 w-8 text-red-600" />
                        <span>تعلم بالفيديو</span>
                    </CardTitle>
                    <CardDescription>
                        شاهد فيديوهات يوتيوب تعليمية مباشرة داخل التطبيق.
                    </CardDescription>
                </CardHeader>
            </Card>

            <Card 
                className="cursor-pointer transform transition-all hover:scale-[1.03] hover:shadow-lg bg-card/70 backdrop-blur-sm"
                onClick={() => setIsWhatIfOpen(true)}
            >
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Brain className="h-8 w-8 text-cyan-500" />
                        <span>ماذا لو؟</span>
                    </CardTitle>
                    <CardDescription>
                        استكشف سيناريوهات افتراضية رائعة مع سلسلة الفيديوهات هذه.
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

    <Dialog open={isLessonsOpen} onOpenChange={setIsLessonsOpen}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
            <DialogHeader className="p-4 border-b shrink-0">
                <DialogTitle>Extra Learning Materials</DialogTitle>
                <DialogDescription>Browse our library of lessons.</DialogDescription>
                 <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>
            </DialogHeader>
            <LessonList />
        </DialogContent>
    </Dialog>
    
    <VideoLearnDialog isOpen={isVideoLearnOpen} onOpenChange={setIsVideoLearnOpen} />
    <WhatIfDialog isOpen={isWhatIfOpen} onOpenChange={setIsWhatIfOpen} />
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
                                    data-ai-hint="story illustration"
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
