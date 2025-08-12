
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
import { LessonDetailDialog } from '@/components/lesson-detail-dialog';
import { chatStream } from '@/ai/flows/chat-flow';
import { useToast } from "@/hooks/use-toast"
import { BookText, Book, Bot, ArrowRight, Sparkles, Image as ImageIcon, GraduationCap, Mic, X, Gamepad2, MessageCircle, Flame, Puzzle, Ear, BookCheck, Library, Loader2, Youtube, PlayCircle, Brain, ChevronLeft, ChevronRight, LightbulbIcon, Volume2, Award, FileQuestion, CheckCircle, NotebookText, Lock, BrainCircuit } from 'lucide-react';
import Image from 'next/image';
import type { ActiveTab } from './main-app';
import { generateStoryImage } from '@/ai/flows/story-image-flow';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
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
import { lessons } from '@/data/lingo-lessons-data';
import type { Lesson } from '@/types/lesson';
import Link from 'next/link';

// Import video links from the new data file
import videoLinks from '@/data/video-links';
import whatIfLinks from '@/data/whatif-links';
import motivationLinks from '@/data/motivation-links';
import { explainVideoTopic, type ExplainVideoOutput } from '@/ai/flows/explain-video-flow';
import { textToSpeech } from '@/ai/flows/tts-flow';

import type { AiLesson } from '@/lib/ai-lessons';
import { aiLessons } from '@/lib/ai-lessons';
import { generateCertificateImage } from '@/ai/flows/generate-certificate-image';
import { QuizScreen } from './quiz-screen';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { cn } from '@/lib/utils';
import { translateText } from '@/ai/flows/translate-flow';
import { useStoryStore, type SavedStory, useQuizStore, type StoryQuizResult } from '@/hooks/use-story-store';
import { useProgressStore } from '@/hooks/use-progress-store';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { learningItems } from '@/lib/lessons';
import { getExtraRag, putExtraRag } from '@/lib/rag';
import { generateExtraLearning } from '@/ai/flows/generate-extra-learning';
import { summarizeYouTubeInArabic } from '@/ai/flows/youtube-transcript-summary';
import { getAiLessonRag, putAiLessonRag } from '@/lib/rag';
import { enrichAiLessonInEnglish, translateAiLessonToArabic } from '@/ai/flows/generate-ai-lesson-content';
import { getAiLessonArabicRag, putAiLessonArabicRag } from '@/lib/rag';
import { coachChat, type CoachChatMessage } from '@/ai/flows/coach-chat-flow';
import { generateFinalExam } from '@/ai/flows/generate-final-exam';
import { useUserTasks } from '@/hooks/use-user-tasks';

// Helper function to extract YouTube embed URL and video ID
const getYouTubeInfo = (url: string): { embedUrl: string | null; videoId: string | null; title: string | null } => {
    let videoId = null;
    let title = null; 
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.slice(1).split('?')[0];
        } else if (urlObj.hostname === 'youtube.com' || urlObj.hostname === 'www.youtube.com') {
             if (urlObj.pathname.startsWith('/live/')) {
                videoId = urlObj.pathname.split('/live/')[1].split('?')[0];
            } else if (urlObj.pathname.startsWith('/shorts/')) {
                videoId = urlObj.pathname.split('/shorts/')[1].split('?')[0];
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
        title = `Video: ${videoId}`;
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
                      <CardTitle as="h3" className="text-xl group-hover:text-primary transition-colors">
                        {lesson.title}
                      </CardTitle>
                      {lesson.title_arabic && (
                        <CardTitle
                          as="h4"
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
            <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
                <DialogHeader className="p-4 border-b shrink-0">
                    <DialogTitle>تعلم بالفيديو</DialogTitle>
                    <DialogDescription>شاهد هذه الفيديوهات التعليمية لتعزيز تعلمك.</DialogDescription>
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
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
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
      const result = await textToSpeech({ prompt: text, lang: 'ar' });
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
  const videoData = whatIfLinks.split('\n').map(getYouTubeInfo).filter(item => item.embedUrl);
  const currentVideo = videoData[currentIndex];
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { toast } = useToast();
  const tasks = useUserTasks();

  useEffect(() => {
    if (currentVideo?.videoId) tasks.markVideoSeen(currentVideo.videoId);
  }, [currentIndex]);

  const goToNext = () => setCurrentIndex(prev => (prev + 1) % videoData.length);
  const goToPrevious = () => setCurrentIndex(prev => (prev - 1 + videoData.length) % videoData.length);

  const summarizeOnce = async () => {
    if (!currentVideo?.videoId) return;
    const ragId = `yt:${currentVideo.videoId}`;
    setIsSummarizing(true);
    setSummary(null);
    try {
      const cached = await getExtraRag(ragId);
      if (cached) {
        setSummary(cached.explanation);
        return;
      }
      const result = await summarizeYouTubeInArabic({ videoId: currentVideo.videoId, title: currentVideo.title || '' });
      setSummary(result.arabicSummary);
      await putExtraRag({ id: ragId, explanation: result.arabicSummary, imageUrls: [], updated_at: new Date().toISOString() });
    } catch (e) {
      toast({ variant: 'destructive', title: 'خطأ', description: 'تعذر توليد الملخص.' });
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
          <DialogHeader className="p-4 border-b shrink-0">
            <DialogTitle>ماذا لو؟ (What If)</DialogTitle>
            <DialogDescription>فيديو {currentIndex + 1} من {videoData.length}.</DialogDescription>
          </DialogHeader>
          <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden shadow-inner">
            {currentVideo?.embedUrl && (
              <iframe
                key={currentVideo.embedUrl}
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
          <div className="flex-col sm:flex-row gap-2 justify-between w-full">
            <Button onClick={goToPrevious} disabled={videoData.length <= 1}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              السابق
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => setIsExplanationOpen(true)}>
                <LightbulbIcon className="mr-2 h-4 w-4" />
                اشرح هذا الفيديو (قديمة)
              </Button>
              <Button onClick={summarizeOnce} disabled={isSummarizing || !currentVideo?.videoId}>
                {isSummarizing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> جاري التلخيص...</> : 'تلخيص عربي (توليد مرة واحدة)'}
              </Button>
            </div>
            <Button onClick={goToNext} disabled={videoData.length <= 1}>
              التالي
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          {summary && (
            <div className="mt-4 p-3 rounded-md border bg-muted text-foreground whitespace-pre-wrap leading-7">
              {summary}
            </div>
          )}
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

function MotivationDialog({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const videoData = motivationLinks.split('\n').map(getYouTubeInfo).filter(item => item.embedUrl);
    const currentVideo = videoData[currentIndex];
    const { toast } = useToast();
    const tasks = useUserTasks();

    useEffect(() => {
        const id = currentVideo?.videoId;
        if (id) tasks.markShortSeen(id);
    }, [currentIndex]);

    const goToNext = () => setCurrentIndex(prev => (prev + 1) % videoData.length);
    const goToPrevious = () => setCurrentIndex(prev => (prev - 1 + videoData.length) % videoData.length);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md h-auto flex flex-col p-4 sm:p-6 gap-4">
                <DialogHeader>
                    <DialogTitle>جرعة تحفيز!</DialogTitle>
                    <DialogDescription>شاهد فيديوهات قصيرة ملهمة. فيديو {currentIndex + 1} من {videoData.length}.</DialogDescription>
                </DialogHeader>
                <div className="w-full aspect-[9/16] bg-muted rounded-lg overflow-hidden shadow-inner">
                    {currentVideo?.embedUrl && (
                        <iframe
                            key={currentVideo.embedUrl}
                            width="100%"
                            height="100%"
                            src={`${currentVideo.embedUrl}?autoplay=1`}
                            title="Motivational Short"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    )}
                </div>
                <div className="flex flex-row gap-2 justify-between w-full">
                    <Button onClick={goToPrevious} disabled={videoData.length <= 1}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        السابق
                    </Button>
                    <Button onClick={goToNext} disabled={videoData.length <= 1}>
                        التالي
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function AiLessonsDialog({ isOpen, onOpenChange, onSelectLesson }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void, onSelectLesson: (lesson: AiLesson) => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader className="p-4 border-b shrink-0">
          <DialogTitle>تعلم عن الذكاء الاصطناعي</DialogTitle>
          <DialogDescription>اختر موضوعًا لتبدأ التعلم.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiLessons.map(lesson => (
              <Card key={lesson.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSelectLesson(lesson)}>
                <CardHeader>
                  <CardTitle as="h3">{lesson.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Image src={lesson.image} alt={lesson.title} width={300} height={150} className="w-full h-auto object-cover rounded-md" data-ai-hint={lesson.image_hint} />
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function AiLessonViewerDialog({ lesson, isOpen, onOpenChange, onBack }: { lesson: AiLesson | null, isOpen: boolean, onOpenChange: (isOpen: boolean) => void, onBack: () => void }) {
  const [englishContent, setEnglishContent] = useState<string | null>(null);
  const [arabicTranslation, setArabicTranslation] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [quiz, setQuiz] = useState<{ question: string; options: string[]; answer: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setEnglishContent(null);
    setArabicTranslation(null);
    setImages([]);
    setQuiz([]);
  }, [lesson]);

  const loadContent = async () => {
    if (!lesson || isLoading) return;
    setIsLoading(true);
    try {
      const cached = await getAiLessonRag(lesson.id);
      if (cached) {
        setEnglishContent(cached.enrichedEnglish);
        setImages(cached.imageUrls);
        setQuiz(cached.quiz);
        return;
      }
      const enriched = await enrichAiLessonInEnglish(lesson.title, lesson.content, lesson.image_hint);
      setEnglishContent(enriched.enrichedEnglish);
      setImages(enriched.imageUrls);
      setQuiz(enriched.quiz);
      await putAiLessonRag({ id: lesson.id, enrichedEnglish: enriched.enrichedEnglish, imageUrls: enriched.imageUrls, quiz: enriched.quiz, updated_at: new Date().toISOString() });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load lesson.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { if (isOpen) loadContent(); }, [isOpen]);

  const handleTranslate = async () => {
    if (!englishContent || isTranslating) return;
    setIsTranslating(true);
    try {
      const cached = await getAiLessonArabicRag(lesson!.id);
      if (cached) {
        setArabicTranslation(cached.arabic);
        return;
      }
      const ar = await translateAiLessonToArabic(englishContent);
      setArabicTranslation(ar);
      await putAiLessonArabicRag({ id: lesson!.id, arabic: ar, updated_at: new Date().toISOString() });
    } catch {
      toast({ variant: 'destructive', title: 'خطأ', description: 'فشل في الترجمة.' });
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[85vh] flex flex-col">
        <DialogHeader className="p-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>{lesson?.title || 'AI Lesson'}</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onBack}>Back</Button>
              <Button variant="secondary" size="sm" onClick={handleTranslate} disabled={!englishContent || isTranslating}>
                {isTranslating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Translating...</> : 'Translate to Arabic'}
              </Button>
            </div>
          </div>
          <DialogDescription>English content enriched with AI; optional Arabic translation. Quiz in English only.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow p-4 space-y-4">
          {isLoading && <div className="text-muted-foreground">Loading lesson...</div>}

          {englishContent && (
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">English Lesson</h4>
              <div className="prose prose-invert max-w-none whitespace-pre-wrap leading-7">{englishContent}</div>
            </div>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {images.map((src, i) => (
                <Image key={i} src={src} alt={`lesson-illustration-${i}`} width={600} height={400} className="w-full h-auto rounded-md object-cover" />
              ))}
            </div>
          )}

          {arabicTranslation && (
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">الترجمة العربية</h4>
              <div className="prose prose-invert max-w-none whitespace-pre-wrap leading-7">{arabicTranslation}</div>
            </div>
          )}

          {quiz.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">English Quiz</h4>
              <div className="space-y-4">
                {quiz.map((q, i) => (
                  <div key={i} className="p-3 rounded-md bg-muted/50">
                    <p className="font-medium">{i + 1}. {q.question}</p>
                    <ul className="list-disc ps-5">
                      {q.options.map((opt, j) => (
                        <li key={j}>{opt}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
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
        // Handle the data: {} format
        const lines = decodedChunk.split('\n\n');
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                try {
                    const json = JSON.parse(line.substring(6));
                    if (json.response) {
                        setResponse(prev => prev + json.response);
                    }
                } catch (e) {
                    console.error("Failed to parse stream chunk JSON:", line);
                }
            }
        }
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
          <CardContent className="flex-grow flex flex-col gap-4 pt-4 min-h-0">
              <ScrollArea className="flex-grow rounded-lg border bg-muted/50 p-4 space-y-2">
                 {response ? (
                    <p className="whitespace-pre-wrap">{response}</p>
                 ) : (
                    <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                        <Bot className="h-10 w-10 mb-2"/>
                        <p>جاهز للإجابة على أسئلتك</p>
                    </div>
                 )}
                 {loading && !response && <div className="flex items-center text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin"/><span>...جارٍ التفكير</span></div>}
              </ScrollArea>
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
                    {loading ? <Loader2 className="animate-spin" /> : <ArrowRight/>}
                </Button>
              </div>
          </CardContent>
      </div>
  );
}

function AiStoryMaker() {
    const { stories, addStory } = useStoryStore();
    const [prompt, setPrompt] = useState("");
    const [storyContent, setStoryContent] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const tasks = useUserTasks();

    const canGenerate = stories.length < 3;

    const generateStory = async () => {
        if (!prompt.trim() || loading || !canGenerate) return;

        setLoading(true);
        setStoryContent("");
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
                const lines = decodedChunk.split('\n\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const json = JSON.parse(line.substring(6));
                            if (json.response) {
                                fullStory += json.response;
                                setStoryContent(prev => prev + json.response);
                            }
                        } catch (e) {
                            console.error("Failed to parse story stream chunk JSON:", line);
                        }
                    }
                }
            }

            const imageResult = await generateStoryImage({ story: fullStory });
            setImageUrl(imageResult.imageUrl);
            addStory({ id: Date.now().toString(), prompt, content: fullStory, imageUrl: imageResult.imageUrl });
            tasks.incrementStory();
            toast({ title: "Story Generated!", description: "Your new story has been saved to your dashboard." });

        } catch (err) {
            console.error("AI story generation error:", err);
            toast({ variant: "destructive", title: "حدث خطأ", description: "لم نتمكن من إنشاء القصة. الرجاء المحاولة مرة أخرى." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <DialogHeader className="p-4 border-b shrink-0">
                <DialogTitle>مولد قصص الذكاء الاصطناعي</DialogTitle>
                <DialogDescription>Turn your ideas into illustrated stories. You can generate {3 - stories.length} more stories.</DialogDescription>
            </DialogHeader>
            <div className="p-4 flex flex-col gap-4 shrink-0">
                 <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="اكتب فكرة لقصة، مثل 'رائد فضاء يجد حديقة على المريخ'..."
                    rows={2}
                    className="w-full p-3 rounded-md focus:ring-2 focus:ring-primary outline-none transition bg-background"
                    disabled={loading || !canGenerate}
                />
                <Button onClick={generateStory} disabled={loading || !prompt.trim() || !canGenerate}>
                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> ...جاري الكتابة</> : <><Sparkles className="mr-2 h-4 w-4"/> إنشاء قصة</>}
                </Button>
                 {!canGenerate && <p className="text-center text-sm text-destructive">You have reached the maximum of 3 stories.</p>}
            </div>
            <ScrollArea className="flex-grow p-4 pt-0 min-h-0">
                 {(loading || storyContent) && (
                    <div className="h-full rounded-lg border bg-muted/50 p-4">
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
                        <p className="whitespace-pre-wrap" dir="ltr">{storyContent}{loading && storyContent.length === 0 ? '...' : ''}</p>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}

function MyStoriesDialog({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
  const { stories } = useStoryStore();
  const { quizResults } = useQuizStore();
  const [viewingStory, setViewingStory] = useState<SavedStory | null>(null);

  const passedCount = Object.values(quizResults || {}).filter(r => r?.passed).length;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader className="p-4 border-b shrink-0">
            <DialogTitle>قصصي واختباراتي</DialogTitle>
            <DialogDescription>
              اقرأ قصصك واختبر فهمك. يجب أن تنجح في اختبارين على الأقل لإكمال هذا القسم.
              <br/>
              <span className={cn("font-bold", passedCount >= 2 ? 'text-green-500' : 'text-amber-500')}>
                الاختبارات التي تم اجتيازها: {passedCount} / {stories.length}
              </span>
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-grow">
            <div className="p-6">
              {stories.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <p>لم تقم بإنشاء أي قصص بعد.</p>
                  <p>اذهب إلى "أدوات الذكاء الاصطناعي" {'>'} "صانع القصص" لتبدأ.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stories.map(story => {
                    const result = quizResults ? quizResults[story.id] : null;
                    return (
                      <Card key={story.id} className="cursor-pointer hover:shadow-xl transition-shadow flex flex-col" onClick={() => setViewingStory(story)}>
                        <CardHeader>
                          {story.imageUrl && <Image src={story.imageUrl} alt={story.prompt} width={400} height={200} className="rounded-t-lg object-cover w-full aspect-video mb-4" />}
                          <CardTitle as="h3" className="line-clamp-2">{story.prompt}</CardTitle>
                        </CardHeader>
                        <CardFooter className="mt-auto pt-4">
                          {result ? (
                            result.passed ? (
                              <div className="text-green-500 font-bold flex items-center"><CheckCircle className="mr-2 h-4 w-4"/> نجحت</div>
                            ) : (
                              <div className="text-destructive font-bold flex items-center"><XCircle className="mr-2 h-4 w-4"/> لم تنجح</div>
                            )
                          ) : (
                            <div className="text-primary font-bold">اقرأ وخذ الاختبار</div>
                          )}
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      {viewingStory && (
          <StoryViewerDialog 
            story={viewingStory} 
            isOpen={!!viewingStory} 
            onOpenChange={(open) => !open && setViewingStory(null)} 
          />
      )}
    </>
  );
}

function StoryViewerDialog({ story, isOpen, onOpenChange }: { story: SavedStory | null, isOpen: boolean, onOpenChange: (open: boolean) => void }) {
  const [activeTab, setActiveTab] = useState<'story' | 'quiz'>('story');
  const { quizResults, setQuizResult } = useQuizStore();
  const [quiz, setQuiz] = useState<StoryQuizOutput['questions'] | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const { toast } = useToast();
  
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen && story) {
        const existingResult = quizResults ? quizResults[story.id] : null;
        if (existingResult) {
            setQuiz(existingResult.questions);
            setAnswers(existingResult.answers);
            setIsSubmitted(true);
        } else {
            setActiveTab('story');
            setQuiz(null);
            setAnswers({});
            setIsSubmitted(false);
        }
    }
  }, [isOpen, story, quizResults]);

  const handleStartQuiz = async () => {
    if (!story) return;
    setIsLoadingQuiz(true);
    try {
      const { generateStoryQuiz } = await import('@/ai/flows/story-quiz-flow');
      const result = await generateStoryQuiz({ storyContent: story.content });
      setQuiz(result.questions);
      setActiveTab('quiz');
    } catch (err) {
      console.error("Quiz generation error:", err);
      toast({ variant: 'destructive', title: 'فشل إنشاء الاختبار' });
    } finally {
      setIsLoadingQuiz(false);
    }
  };
  
  const handleAnswerChange = (qIndex: number, option: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmitQuiz = () => {
    if (!story || !quiz) return;
    setIsSubmitted(true);
    const score = quiz.reduce((acc, q, i) => (answers[i] === q.correct_answer ? acc + 1 : acc), 0);
    const passed = score >= 4;

    const result: StoryQuizResult = {
      storyId: story.id,
      questions: quiz,
      answers,
      score,
      passed,
    };
    setQuizResult(result);

    toast({ title: `Quiz Finished!`, description: `Your score: ${score} / ${quiz.length}. ${passed ? 'You passed!' : 'Try again!'}` });
  };
  
  if (!story) { 
    return null;
  }

  const currentQuizResult = quizResults ? quizResults[story.id] : null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
            <DialogHeader className="p-4 border-b shrink-0">
                <DialogTitle>{story.prompt}</DialogTitle>
            </DialogHeader>
            <div className="flex border-b">
                <Button variant={activeTab === 'story' ? 'secondary': 'ghost'} onClick={() => setActiveTab('story')} className="rounded-none flex-1">Story</Button>
                <Button variant={activeTab === 'quiz' ? 'secondary': 'ghost'} onClick={handleStartQuiz} disabled={isLoadingQuiz} className="rounded-none flex-1">
                    {isLoadingQuiz ? <Loader2 className="animate-spin" /> : 'Quiz'}
                </Button>
            </div>
            {activeTab === 'story' && (
                <ScrollArea className="flex-grow">
                    <div className="p-6">
                        {story.imageUrl && <Image src={story.imageUrl} alt={story.prompt} width={600} height={400} className="w-full h-auto object-cover rounded-md mb-4" />}
                        <p className="whitespace-pre-wrap leading-relaxed">{story.content}</p>
                    </div>
                </ScrollArea>
            )}
            {activeTab === 'quiz' && quiz && (
                <ScrollArea className="flex-grow">
                    <div className="p-6">
                        {isSubmitted && currentQuizResult && (
                            <Alert className={cn("mb-4", currentQuizResult.passed ? 'bg-green-100 dark:bg-green-900 border-green-500' : 'bg-destructive/10 border-destructive')}>
                                <AlertTitle className={cn(currentQuizResult.passed ? 'text-green-700 dark:text-green-300' : 'text-destructive')}>
                                    {currentQuizResult.passed ? "Passed!" : "Needs Improvement"}
                                </AlertTitle>
                                <AlertDescription>Your score: {currentQuizResult.score} / {quiz.length}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-6">
                            {quiz.map((q, i) => (
                                <div key={i} className={cn("p-4 border rounded-lg", isSubmitted && (answers[i] === q.correct_answer ? 'border-green-500' : 'border-destructive'))}>
                                    <p className="font-semibold mb-3">{i + 1}. {q.question}</p>
                                    <RadioGroup value={answers[i]} onValueChange={(val) => handleAnswerChange(i, val)} disabled={isSubmitted}>
                                        {q.options.map(opt => {
                                            const isCorrect = opt === q.correct_answer;
                                            const isSelected = answers[i] === opt;
                                            return (
                                                <div key={opt} className={cn("flex items-center space-x-2 rounded-md p-2", isSubmitted && isCorrect && "bg-green-500/10 text-green-800 dark:text-green-300", isSubmitted && isSelected && !isCorrect && "bg-destructive/10 text-destructive")}>
                                                    <RadioGroupItem value={opt} id={`sq${i}-opt-${opt}`} />
                                                    <Label htmlFor={`sq${i}-opt-${opt}`} className="flex-1 cursor-pointer">{opt}</Label>
                                                    {isSubmitted && isCorrect && <Check className="h-5 w-5 text-green-500" />}
                                                    {isSubmitted && isSelected && !isCorrect && <X className="h-5 w-5 text-destructive" />}
                                                </div>
                                            )
                                        })}
                                    </RadioGroup>
                                </div>
                            ))}
                        </div>
                         <div className="mt-6 flex justify-end">
                            {!isSubmitted && <Button onClick={handleSubmitQuiz} disabled={Object.keys(answers).length !== (quiz?.length || 0)}>إرسال الإجابات</Button>}
                        </div>
                    </div>
                </ScrollArea>
            )}
        </DialogContent>
    </Dialog>
  );
}


function DashboardCard({ title, description, icon, onClick, unlockThreshold, completedCount }: { title: string, description: string, icon: React.ReactNode, onClick?: () => void, unlockThreshold: number, completedCount: number }) {
  const isLocked = false; // UNLOCK ALL FOR TESTING

  const content = (
      <CardHeader>
          <CardTitle as="h3" className="flex items-center gap-3">
              {icon}
              <span>{title}</span>
          </CardTitle>
          <CardDescription>
              {isLocked ? `أكمل ${unlockThreshold} درسًا لفتح هذه الميزة.` : description}
          </CardDescription>
      </CardHeader>
  );
  
  if (isLocked) {
      return (
           <TooltipProvider>
              <Tooltip>
                  <TooltipTrigger asChild>
                      <Card className="bg-muted/30 border-dashed cursor-not-allowed relative overflow-hidden">
                          <div className="absolute inset-0 bg-black/20 z-10"></div>
                          <Lock className="absolute top-4 right-4 h-5 w-5 text-white/50 z-20" />
                          {content}
                      </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                      <p>أكمل {unlockThreshold} درسًا للفتح</p>
                  </TooltipContent>
              </Tooltip>
          </TooltipProvider>
      );
  }

  return (
    <Card 
      className="cursor-pointer transform transition-all hover:scale-[1.03] hover:shadow-lg bg-card/70 backdrop-blur-sm"
      onClick={onClick}
    >
      {content}
    </Card>
  );
}

export function HomeScreen({ setActiveTab }: { setActiveTab: (tab: ActiveTab) => void }) {
    const { completedItemsCount } = useProgressStore();

    const [dialogs, setDialogs] = useState({
        lingoleap: false,
        adventure: false,
        jumble: false,
        tenseTeacher: false,
        lessons: false,
        videoLearn: false,
        whatIf: false,
        motivation: false,
        myStories: false,
        chat: false,
        storyMaker: false,
        aiLessons: false,
        voiceAssistant: false
    });

    const [selectedAiLesson, setSelectedAiLesson] = useState<AiLesson | null>(null);
    const [isLessonViewerOpen, setIsLessonViewerOpen] = useState(false);

    const openDialog = (name: keyof typeof dialogs) => {
        setDialogs(prev => ({...prev, [name]: true}));
    };

    const closeDialog = (name: keyof typeof dialogs) => {
        setDialogs(prev => ({...prev, [name]: false}));
    };
    
    const handleSelectLesson = (lesson: AiLesson) => {
        setSelectedAiLesson(lesson);
        closeDialog('aiLessons');
        setIsLessonViewerOpen(true);
    };

    const handleBackToList = () => {
        setIsLessonViewerOpen(false);
        openDialog('aiLessons');
    };
    
  return (
    <>
    <section className="animate-fadeIn">
        <h2 className="text-4xl font-bold mb-4 text-center">لوحة التحكم الخاصة بك</h2>
         <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            مرحباً بك! ابدأ رحلتك التعليمية من هنا.
        </p>
        
        <div className="mb-10">
            <h3 className="text-2xl font-bold mb-4">الأدوات التفاعلية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <DashboardCard title="مُنشئ المفردات" description="قم بتوسيع مفرداتك مع كلمات وتعريفات وأمثلة مولدة بالذكاء الاصطناعي."
                  icon={<GraduationCap className="h-8 w-8 text-primary" />} onClick={() => openDialog('lingoleap')}
                  unlockThreshold={0} completedCount={completedItemsCount} />

                <DashboardCard title="مغامرة جيمني" description="العب لعبة مغامرة نصية لتعلم المفردات في سياقها."
                  icon={<Gamepad2 className="h-8 w-8 text-accent" />} onClick={() => openDialog('adventure')}
                  unlockThreshold={0} completedCount={completedItemsCount} />
                  
                <DashboardCard title="صانع القصص" description="حوّل أفكارك إلى قصص قصيرة مصورة باللغة الإنجليزية."
                  icon={<Sparkles className="h-8 w-8 text-yellow-500" />} onClick={() => openDialog('storyMaker')}
                  unlockThreshold={0} completedCount={completedItemsCount} />

                <DashboardCard title="خبير الأزمنة" description="تحدث مع خبير الذكاء الاصطناعي لإتقان أزمنة اللغة الإنجليزية."
                  icon={<BookCheck className="h-8 w-8 text-destructive" />} onClick={() => openDialog('tenseTeacher')}
                  unlockThreshold={0} completedCount={completedItemsCount} />

                <DashboardCard title="لعبة الكلمات المبعثرة" description="أعد ترتيب الحروف لتكوين كلمات وحسّن مهاراتك الإملائية."
                  icon={<Puzzle className="h-8 w-8 text-secondary" />} onClick={() => openDialog('jumble')}
                  unlockThreshold={0} completedCount={completedItemsCount} />
                
                <DashboardCard title="قصصي واختباراتي" description="اقرأ القصص التي أنشأتها واختبر فهمك."
                  icon={<NotebookText className="h-8 w-8 text-pink-500" />} onClick={() => openDialog('myStories')}
                  unlockThreshold={0} completedCount={completedItemsCount} />
                
                <DashboardCard title="المساعد الصوتي" description="تدرب على المحادثة مع مساعد صوتي يعمل بالذكاء الاصطناعي."
                  icon={<Ear className="h-8 w-8 text-cyan-500" />} onClick={() => openDialog('voiceAssistant')}
                  unlockThreshold={0} completedCount={completedItemsCount} />
            </div>
        </div>

        <div className="mb-10">
            <h3 className="text-2xl font-bold mb-4">الموارد التعليمية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard title="مواد تعليمية" description="تصفح مكتبة الدروس المنظمة حسب المستوى والموضوع."
                  icon={<Library className="h-8 w-8 text-green-500" />} onClick={() => openDialog('lessons')}
                  unlockThreshold={0} completedCount={completedItemsCount} />
                
                <DashboardCard title="تعلم بالفيديو" description="شاهد فيديوهات يوتيوب تعليمية مباشرة داخل التطبيق."
                  icon={<Youtube className="h-8 w-8 text-red-600" />} onClick={() => openDialog('videoLearn')}
                  unlockThreshold={0} completedCount={completedItemsCount} />

                <DashboardCard title="ماذا لو...؟" description="استكشف سيناريوهات علمية رائعة مع شرح الذكاء الاصطناعي."
                  icon={<Brain className="h-8 w-8 text-purple-500" />} onClick={() => openDialog('whatIf')}
                  unlockThreshold={0} completedCount={completedItemsCount} />

                <DashboardCard title="جرعة تحفيز" description="فيديوهات قصيرة لإلهامك ومواصلة رحلتك التعليمية."
                  icon={<Flame className="h-8 w-8 text-orange-500" />} onClick={() => openDialog('motivation')}
                  unlockThreshold={0} completedCount={completedItemsCount} />
                
                <DashboardCard title="تعلم عن الذكاء الاصطناعي" description="دروس مبسطة حول الذكاء الاصطناعي، مع شروحات صوتية باللغة العربية."
                  icon={<BrainCircuit className="h-8 w-8 text-teal-500" />} onClick={() => openDialog('aiLessons')}
                  unlockThreshold={0} completedCount={completedItemsCount} />
            </div>
        </div>

        {/* AI Chat is always available */}
        <h3 className="text-2xl font-bold mb-4">هل لديك سؤال؟</h3>
        <Card 
            className="cursor-pointer transform transition-all hover:scale-[1.03] hover:shadow-lg bg-card/70 backdrop-blur-sm"
            onClick={() => openDialog('chat')}
        >
            <CardHeader>
                <CardTitle as="h3" className="flex items-center gap-3">
                    <MessageCircle className="h-8 w-8 text-primary" />
                    <span>دردشة الذكاء الاصطناعي</span>
                </CardTitle>
                <CardDescription>
                    اطرح أسئلة عامة عن اللغة الإنجليزية واحصل على إجابات فورية.
                </CardDescription>
            </CardHeader>
        </Card>

    </section>

    {/* Dialogs for interactive tools */}
    <Dialog open={dialogs.lingoleap} onOpenChange={(open) => !open && closeDialog('lingoleap')}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
             <DialogHeader className="p-4 border-b">
                <DialogTitle>LinguaLeap Vocabulary Builder</DialogTitle>
                <DialogDescription className="sr-only">An AI-powered tool to expand your vocabulary.</DialogDescription>
            </DialogHeader>
            <div className="flex-grow min-h-0">
                <LingoleapApp />
            </div>
             <DialogClose asChild><Button type="button" variant="secondary" className="absolute top-2 right-2">Close</Button></DialogClose>
        </DialogContent>
    </Dialog>
     <Dialog open={dialogs.adventure} onOpenChange={(open) => !open && closeDialog('adventure')}>
        <DialogContent className="max-w-full w-full h-screen max-h-screen p-0 m-0 rounded-none border-0">
             <DialogHeader className="p-4 border-b absolute top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-10">
                <DialogTitle>Gemini Text Adventure</DialogTitle>
                 <DialogDescription className="sr-only">An interactive text adventure game to learn vocabulary.</DialogDescription>
            </DialogHeader>
            <div className="flex-grow h-full pt-[65px]">
                <TextAdventureApp />
            </div>
             <DialogClose asChild><Button type="button" variant="secondary" className="absolute top-2 right-2 z-20">Close</Button></DialogClose>
        </DialogContent>
    </Dialog>
     <Dialog open={dialogs.jumble} onOpenChange={(open) => !open && closeDialog('jumble')}>
        <DialogContent className="max-w-full w-full h-screen max-h-screen p-0 m-0 rounded-none border-0">
             <DialogHeader className="p-4 border-b absolute top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-10">
                <DialogTitle>Jumble Game</DialogTitle>
                <DialogDescription className="sr-only">A game to unscramble letters and improve spelling.</DialogDescription>
            </DialogHeader>
            <div className="flex-grow h-full pt-[65px]">
                <MumbleJumbleApp />
            </div>
             <DialogClose asChild><Button type="button" variant="secondary" className="absolute top-2 right-2 z-20">Close</Button></DialogClose>
        </DialogContent>
    </Dialog>
     <Dialog open={dialogs.tenseTeacher} onOpenChange={(open) => !open && closeDialog('tenseTeacher')}>
        <DialogContent className="w-full max-w-4xl h-[90vh] flex flex-col p-0">
             <DialogHeader className="p-4 border-b shrink-0">
                <DialogTitle>Tense Teacher</DialogTitle>
                <DialogDescription>A voice-based AI expert to help you master English tenses.</DialogDescription>
            </DialogHeader>
            <TenseTeacherApp />
             <DialogClose asChild><Button type="button" variant="secondary" className="absolute top-2 right-2">Close</Button></DialogClose>
        </DialogContent>
    </Dialog>
    <Dialog open={dialogs.lessons} onOpenChange={(open) => !open && closeDialog('lessons')}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
            <DialogHeader className="p-4 border-b shrink-0">
                <DialogTitle>Extra Learning Materials</DialogTitle>
                <DialogDescription>Browse our library of lessons.</DialogDescription>
            </DialogHeader>
            <LessonList />
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Close</Button></DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    
    <Dialog open={dialogs.storyMaker} onOpenChange={(open) => !open && closeDialog('storyMaker')}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
          <AiStoryMaker />
      </DialogContent>
    </Dialog>
    
    <MyStoriesDialog isOpen={dialogs.myStories} onOpenChange={(open) => !open && closeDialog('myStories')} />
    <VideoLearnDialog isOpen={dialogs.videoLearn} onOpenChange={(open) => !open && closeDialog('videoLearn')} />
    <WhatIfDialog isOpen={dialogs.whatIf} onOpenChange={(open) => !open && closeDialog('whatIf')} />
    <MotivationDialog isOpen={dialogs.motivation} onOpenChange={(open) => !open && closeDialog('motivation')} />

    <Dialog open={dialogs.chat} onOpenChange={(open) => !open && closeDialog('chat')}>
        <DialogContent className="max-w-2xl h-[70vh] flex flex-col p-0">
            <AiChat />
        </DialogContent>
    </Dialog>
    
    <Dialog open={dialogs.voiceAssistant} onOpenChange={(open) => !open && closeDialog('voiceAssistant')}>
      <DialogContent className="max-w-full w-full h-screen max-h-screen p-0 m-0 rounded-none border-0">
          <DialogHeader className="sr-only">
              <DialogTitle>Voice Assistant</DialogTitle>
              <DialogDescription>Practice conversation with a voice-based AI assistant.</DialogDescription>
          </DialogHeader>
          <ChatterbotApp />
           <DialogClose asChild><Button type="button" variant="secondary" className="absolute top-2 right-2 z-20">Close</Button></DialogClose>
      </DialogContent>
    </Dialog>

    <AiLessonsDialog 
        isOpen={dialogs.aiLessons} 
        onOpenChange={(open) => !open && closeDialog('aiLessons')} 
        onSelectLesson={handleSelectLesson} 
    />

    <AiLessonViewerDialog 
        lesson={selectedAiLesson}
        isOpen={isLessonViewerOpen}
        onOpenChange={setIsLessonViewerOpen}
        onBack={handleBackToList}
    />
    </>
  );
}

export function BookScreen() {
    const [selectedItem, setSelectedItem] = useState<LearningItem | null>(null);
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const { highestItemCompleted } = useProgressStore();

    const allItemTitles = learningItems.map(item => item.title);
    const highestCompletedIndex = highestItemCompleted ? allItemTitles.indexOf(highestItemCompleted) : -1;
    const allLessonsAndStoriesCompleted = highestCompletedIndex >= allItemTitles.length - 1;

    const handleOpenQuiz = () => {
        setIsQuizOpen(true);
    };

    return (
        <section className="animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-center">المكتبة التعليمية</h2>
            <p className="text-center text-muted-foreground mb-4">أكمل الدروس والقصص بالترتيب لفتح المزيد.</p>
            <ScrollArea className="h-[calc(100vh-220px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {learningItems.map((item, i) => {
                        const isLocked = i > highestCompletedIndex + 1; // can open current next item only

                        return (
                          <Card 
                            key={i} 
                            className={cn(
                              "transform transition-all flex flex-col",
                              isLocked 
                                ? "bg-muted/30 border-dashed cursor-not-allowed" 
                                : "hover:scale-[1.03] hover:shadow-lg bg-card/70 backdrop-blur-sm cursor-pointer"
                            )}
                            onClick={() => !isLocked && setSelectedItem(item)}
                          >
                            <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
                              <div className="flex items-center gap-2">
                                {item.type === 'lesson' ? (
                                  <Book className="h-6 w-6 text-primary" />
                                ) : (
                                  <BookText className="h-6 w-6 text-accent" />
                                )}
                                <CardTitle as="h3" className={cn("text-lg", isLocked ? "text-muted-foreground" : "text-primary")}>{item.title}</CardTitle>
                              </div>
                              {isLocked && <Lock className="h-5 w-5 text-muted-foreground" />}
                            </CardHeader>
                          </Card>
                        )})}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            onClick={allLessonsAndStoriesCompleted ? handleOpenQuiz : undefined}
                          >
                            <Card
                              className={cn(
                                "transform transition-all flex flex-col h-full",
                                allLessonsAndStoriesCompleted
                                  ? "hover:scale-[1.03] hover:shadow-lg bg-accent/20 backdrop-blur-sm cursor-pointer border-accent"
                                  : "bg-muted/30 border-dashed cursor-not-allowed relative overflow-hidden"
                              )}
                            >
                              {!allLessonsAndStoriesCompleted && (
                                <>
                                  <div className="absolute inset-0 bg-black/20 z-10"></div>
                                  <Lock className="absolute top-4 right-4 h-5 w-5 text-white/50 z-20" />
                                </>
                              )}
                              <CardHeader>
                                <CardTitle as="h3" className="text-lg text-accent text-center flex items-center justify-center gap-2">
                                  <FileQuestion className="h-6 w-6" />
                                  الاختبار النهائي
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <CardDescription className="text-center text-muted-foreground">
                                  {allLessonsAndStoriesCompleted 
                                    ? "Test your knowledge with questions from the library."
                                    : `أكمل ${learningItems.length - (highestCompletedIndex + 1)} عنصرًا إضافيًا لفتح الاختبار النهائي.`
                                  }
                                </CardDescription>
                              </CardContent>
                            </Card>
                          </div>
                        </TooltipTrigger>
                        {!allLessonsAndStoriesCompleted && (
                          <TooltipContent>
                            <p>أكمل جميع الدروس والقصص لفتح الاختبار النهائي.</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                </div>
            </ScrollArea>
            {selectedItem && (
                <LessonDetailDialog 
                    item={selectedItem}
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            )}
            <Dialog open={isQuizOpen} onOpenChange={setIsQuizOpen}>
                <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
                    <DialogHeader className="p-4 border-b shrink-0">
                        <DialogTitle>AI Generated Quiz</DialogTitle>
                        <DialogDescription>Test your knowledge with questions from the library.</DialogDescription>
                    </DialogHeader>
                    <QuizScreen />
                </DialogContent>
            </Dialog>
        </section>
    );
}

export function AiScreen({ setActiveTab }: { setActiveTab: (tab: ActiveTab) => void }) {
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
                        <CardTitle as="h3" className="flex items-center gap-3">
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
                        <CardTitle as="h3" className="flex items-center gap-3">
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
                        <CardTitle as="h3" className="flex items-center gap-3">
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
                <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
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
                     <DialogClose asChild><Button type="button" variant="secondary" className="absolute top-2 right-2 z-20">Close</Button></DialogClose>
                </DialogContent>
            </Dialog>
        </section>
    );
}

export function ProgressScreen() {
    const { completedItemsCount, finalExamPassed } = useProgressStore();
    const tasks = useUserTasks();
    const { stories } = useStoryStore();
    const [isCertificateOpen, setIsCertificateOpen] = useState(false);

    // Task requirements
    const REQUIRED_LINGOALEAP = 50;
    const REQUIRED_ADVENTURE = 10;
    const REQUIRED_STORIES = 3;
    const REQUIRED_AHMED_TENSES = 20; // per TENSES_LIST
    const REQUIRED_SARA_TOPICS = 25; // per SARA_ADVANCED_TOPICS

    // Videos data counts
    const whatIfData = whatIfLinks.split('\n').map(getYouTubeInfo).filter(v => v.videoId);
    const shortsData = motivationLinks.split('\n').map(getYouTubeInfo).filter(v => v.videoId);

    // Completions
    const lingoleapDone = tasks.lingoleapGenCount >= REQUIRED_LINGOALEAP;
    const adventureDone = tasks.textAdventureGenCount >= REQUIRED_ADVENTURE;
    const storiesDone = tasks.storyGenCount >= REQUIRED_STORIES;
    const ahmedDone = tasks.ahmedTensesUsed.length >= REQUIRED_AHMED_TENSES;
    const saraDone = tasks.saraTopicsUsed.length >= REQUIRED_SARA_TOPICS;
    const videosDone = tasks.videosSeen.length >= whatIfData.length && whatIfData.length > 0;
    const shortsDone = tasks.shortsSeen.length >= shortsData.length && shortsData.length > 0;
    const chatterbotDone = tasks.chatterbotMsSpoken >= 30 * 60 * 1000;

    const allTasksComplete = lingoleapDone && adventureDone && storiesDone && ahmedDone && saraDone && videosDone && shortsDone && chatterbotDone;

    const chartData = [
      { label: 'LinguaLeap', value: Math.min(tasks.lingoleapGenCount, REQUIRED_LINGOALEAP), max: REQUIRED_LINGOALEAP },
      { label: 'Text Adventure', value: Math.min(tasks.textAdventureGenCount, REQUIRED_ADVENTURE), max: REQUIRED_ADVENTURE },
      { label: 'Stories', value: Math.min(tasks.storyGenCount, REQUIRED_STORIES), max: REQUIRED_STORIES },
      { label: 'Ahmed Tenses', value: Math.min(tasks.ahmedTensesUsed.length, REQUIRED_AHMED_TENSES), max: REQUIRED_AHMED_TENSES },
      { label: 'Sara Topics', value: Math.min(tasks.saraTopicsUsed.length, REQUIRED_SARA_TOPICS), max: REQUIRED_SARA_TOPICS },
      { label: 'What If Videos', value: Math.min(tasks.videosSeen.length, whatIfData.length), max: Math.max(whatIfData.length, 1) },
      { label: 'Motivation Shorts', value: Math.min(tasks.shortsSeen.length, shortsData.length), max: Math.max(shortsData.length, 1) },
      { label: 'Chatterbot (min)', value: Math.floor(tasks.chatterbotMsSpoken / 60000), max: 30 },
    ];

    return (
      <>
        <section className="animate-fadeIn space-y-6">
          <Card className="bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Progress Overview</CardTitle>
              <CardDescription>Real-time progress across all required tasks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {chartData.map((c, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm"><span>{c.label}</span><span>{c.value}/{c.max}</span></div>
                  <Progress value={(c.value / c.max) * 100} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Remaining Tasks</CardTitle>
              <CardDescription>Complete all tasks and pass the final exam to unlock your certificate.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="list-disc ps-5">
                {!lingoleapDone && <li>LinguaLeap generations remaining: {Math.max(REQUIRED_LINGOALEAP - tasks.lingoleapGenCount, 0)}</li>}
                {!adventureDone && <li>Text Adventure starts remaining: {Math.max(REQUIRED_ADVENTURE - tasks.textAdventureGenCount, 0)}</li>}
                {!storiesDone && <li>Stories remaining: {Math.max(REQUIRED_STORIES - tasks.storyGenCount, 0)}</li>}
                {!ahmedDone && <li>Ahmed tenses remaining: {Math.max(REQUIRED_AHMED_TENSES - tasks.ahmedTensesUsed.length, 0)}</li>}
                {!saraDone && <li>Sara advanced topics remaining: {Math.max(REQUIRED_SARA_TOPICS - tasks.saraTopicsUsed.length, 0)}</li>}
                {!videosDone && <li>What If videos remaining: {Math.max(whatIfData.length - tasks.videosSeen.length, 0)}</li>}
                {!shortsDone && <li>Motivation shorts remaining: {Math.max(shortsData.length - tasks.shortsSeen.length, 0)}</li>}
                {!chatterbotDone && <li>Chatterbot English speaking time remaining (minutes): {Math.max(30 - Math.floor(tasks.chatterbotMsSpoken / 60000), 0)}</li>}
                {allTasksComplete && <li>All tasks complete!</li>}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certificate</CardTitle>
              <CardDescription>Generate your certificate when eligible.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <Button onClick={() => setIsCertificateOpen(true)} disabled={!(allTasksComplete && finalExamPassed)}>Generate Certificate</Button>
              {!(allTasksComplete && finalExamPassed) && (
                <p className="text-sm text-muted-foreground">Complete all tasks and pass the Final Exam to unlock.</p>
              )}
            </CardContent>
          </Card>
        </section>
      </>
    );
}

function CertificateDialog({ isOpen, onOpenChange, userName }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void, userName: string }) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { finalExamPassed } = useProgressStore();

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            generateCertificateImage({ userName })
                .then(result => setImageUrl(result.imageUrl))
                .catch(err => {
                    console.error("Certificate generation error:", err);
                    toast({ variant: 'destructive', title: 'فشل إنشاء الشهادة' });
                })
                .finally(() => setIsLoading(false));
        } else {
            // Reset when dialog closes
            setImageUrl(null);
        }
    }, [isOpen, userName, toast]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>شهادة إتمام</DialogTitle>
                    <DialogDescription>
                         تهانينا على تقدمك! هذه شهادتك.
                    </DialogDescription>
                </DialogHeader>
                <div className="relative aspect-[4/3] w-full flex items-center justify-center bg-muted rounded-md overflow-hidden">
                    {isLoading && <Loader2 className="h-12 w-12 animate-spin text-primary" />}
                    {imageUrl && (
                        <>
                          <Image src={imageUrl} alt="Certificate Background" fill className="object-cover"/>
                          <div className="absolute inset-0 bg-black/10"></div>
                           <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8 text-foreground">
                                <p className="text-xl">This certifies that</p>
                                <h2 className="text-4xl font-bold text-primary my-4">{userName}</h2>
                                <p className="text-xl">has successfully completed the Speed of Mastery English course.</p>
                                <div className="mt-8 flex items-center gap-4">
                                    <div className='w-[100px] h-[50px] bg-white rounded-full' data-ai-hint="speed of mastery logo"></div>
                                    <div>
                                        <p className="border-t border-foreground pt-1">Signature</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

<<<<<<< Current (Your changes)
=======
function ArabicCoachDialog({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
  const [history, setHistory] = useState<CoachChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const send = async () => {
    const msg = input.trim();
    if (!msg || isSending) return;
    setIsSending(true);
    const newHistory = [...history, { role: 'user', content: msg }];
    setHistory(newHistory);
    setInput('');
    try {
      const out = await coachChat({ message: msg, history: newHistory });
      setHistory(prev => [...prev, { role: 'assistant', content: out.answer }]);
    } catch {
      setHistory(prev => [...prev, { role: 'assistant', content: 'عذرًا، حدث خطأ. حاول مرة أخرى.' }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>مدرب التعلم (عربي)</DialogTitle>
          <DialogDescription>دردشة بالعربية تعتمد فقط على محتوى التطبيق.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow p-2 space-y-2">
          {history.map((m, i) => (
            <div key={i} className={`p-2 rounded-md ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`} dir="rtl">
              {m.content}
            </div>
          ))}
        </ScrollArea>
        <div className="flex gap-2">
          <Textarea dir="rtl" value={input} onChange={e => setInput(e.target.value)} rows={1} placeholder="اكتب رسالتك بالعربية..."/>
          <Button onClick={send} disabled={isSending || !input.trim()}>{isSending ? '...' : 'إرسال'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FinalExamDialog({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (open: boolean) => void }) {
  const [questions, setQuestions] = useState<{ question: string; options: string[]; correct_answer: string }[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(70 * 60); // seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setFinalExamPassed } = useProgressStore();

  useEffect(() => {
    let timer: any;
    if (startedAt) {
      timer = setInterval(() => {
        setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => timer && clearInterval(timer);
  }, [startedAt]);

  const startExam = async () => {
    const gen = await generateFinalExam();
    setQuestions(gen.questions);
    setAnswers({});
    setStartedAt(Date.now());
    setTimeLeft(70 * 60);
  };

  useEffect(() => { if (isOpen) startExam(); }, [isOpen]);

  const submit = async () => {
    if (!questions.length || isSubmitting) return;
    setIsSubmitting(true);
    const score = questions.reduce((acc, q, i) => (answers[i] === q.correct_answer ? acc + 1 : acc), 0);
    const percent = (score / questions.length) * 100;
    const passed = percent >= 70;
    setFinalExamPassed(passed);
    onOpenChange(false);
    alert(`Your score: ${score}/100 (${percent.toFixed(0)}%). ${percent >= 80 ? 'Excellent' : passed ? 'Good' : 'Try again'}.`);
    setIsSubmitting(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  useEffect(() => { if (timeLeft === 0 && isOpen) submit(); }, [timeLeft]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
        <DialogHeader className="p-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Final Exam (100 Questions – 70 minutes)</DialogTitle>
            <div className="text-sm">Time left: {minutes.toString().padStart(2,'0')}:{seconds.toString().padStart(2,'0')}</div>
          </div>
          <DialogDescription>All questions in English. Score ≥ 80: Excellent; 70–79: Good; else: fail.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow p-4 space-y-4">
          {!questions.length ? (
            <div className="text-muted-foreground">Preparing exam...</div>
          ) : (
            questions.map((q, i) => (
              <div key={i} className="p-3 rounded-md bg-muted/50 space-y-2">
                <p className="font-medium">{i + 1}. {q.question}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map(opt => (
                    <button
                      key={opt}
                      className={`text-left p-2 rounded-md border ${answers[i] === opt ? 'border-primary' : 'border-border'} hover:bg-accent`}
                      onClick={() => setAnswers(prev => ({ ...prev, [i]: opt }))}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </ScrollArea>
        <div className="p-4 flex justify-end gap-2 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={!questions.length || isSubmitting}>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

>>>>>>> Incoming (Background Agent changes)
    
