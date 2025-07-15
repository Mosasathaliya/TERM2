/**
 * @fileoverview Defines the content for each screen/tab of the application.
 */
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Lesson } from '@/lib/lessons';
import { lessons } from '@/lib/lessons';
import { LessonDetailDialog } from '@/components/lesson-detail-dialog';


export function HomeScreen() {
  return (
    <section className="animate-fadeIn text-center flex flex-col items-center justify-center h-[60vh]">
      <h2 className="text-4xl font-bold mb-4">أهلاً بك في TriNav</h2>
    </section>
  );
}

export function BookScreen() {
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

    return (
        <section className="animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-center">دروس اللغة الإنجليزية</h2>
            <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {lessons.map((lesson, i) => (
                        <Card 
                            key={i} 
                            className="transform transition-all hover:scale-[1.03] hover:shadow-lg bg-card/70 backdrop-blur-sm flex flex-col cursor-pointer"
                            onClick={() => setSelectedLesson(lesson)}
                        >
                            <CardHeader>
                                <CardTitle className="text-lg text-primary text-center">{lesson.title}</CardTitle>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
            {selectedLesson && (
                <LessonDetailDialog 
                    lesson={selectedLesson}
                    isOpen={!!selectedLesson}
                    onClose={() => setSelectedLesson(null)}
                />
            )}
        </section>
    );
}


export function AiScreen() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const askAI = () => {
    if (!input.trim()) return;
    setResponse(`لقد سألت: "${input}". إليك كيف يمكننا المساعدة...`);
    setInput("");
  };

  return (
    <section className="animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">اسأل الذكاء الاصطناعي</h2>
      <Card className="bg-card/70 backdrop-blur-sm">
        <CardContent className="pt-6">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب سؤالك هنا..."
            rows={3}
            className="w-full p-3 rounded-md focus:ring-2 focus:ring-primary outline-none transition bg-background"
          />
          <Button
            onClick={askAI}
            className="mt-3"
          >
            إرسال السؤال
          </Button>
        </CardContent>
      </Card>
      {response && (
        <Card className="mt-4 bg-card/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <p>{response}</p>
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
                    <CardTitle className="uppercase text-xs text-muted-foreground">الدروس المتبقية</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">66</p>
                </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
