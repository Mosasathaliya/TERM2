/**
 * @fileoverview Defines the content for each screen/tab of the application.
 */
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export function HomeScreen() {
  return (
    <section className="animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">أهلاً بك في TriNav</h2>
    </section>
  );
}

export function BookScreen() {
  const books = [
    { title: "فن التعلّم", author: "اسم المؤلف", hint: "art learning" },
    { title: "التصميم من أجل التأثير", author: "اسم المؤلف", hint: "design impact" },
    { title: "إتقان رياكت", author: "اسم المؤلف", hint: "code react" },
  ];
  return (
    <section className="animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">مكتبتك</h2>
      <div className="space-y-4">
        {books.map((book, i) => (
          <Card key={i} className="transform transition-all hover:scale-[1.02] hover:shadow-lg">
            <CardContent className="p-4 flex items-center gap-4">
              <Image 
                src={`https://placehold.co/200x300.png`} 
                alt={book.title} 
                width={64} 
                height={80} 
                className="w-16 h-20 object-cover rounded"
                data-ai-hint={book.hint}
              />
              <div>
                <h3 className="font-medium">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
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
      <Card>
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
        <Card className="mt-4">
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
      <Card>
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
                    <p className="text-2xl font-bold">14/20</p>
                </CardContent>
            </Card>
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="uppercase text-xs text-muted-foreground">الدروس المتبقية</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">6</p>
                </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
