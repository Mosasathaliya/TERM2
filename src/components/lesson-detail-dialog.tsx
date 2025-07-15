
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Volume2, MessageSquare, BookOpen, BrainCircuit } from 'lucide-react';
import type { Lesson } from '@/lib/lessons';
import { textToSpeech } from '@/ai/flows/tts-flow';

interface LessonDetailDialogProps {
  lesson: Lesson;
  isOpen: boolean;
  onClose: () => void;
}

export function LessonDetailDialog({ lesson, isOpen, onClose }: LessonDetailDialogProps) {
  const [activeTab, setActiveTab] = React.useState<'explanation' | 'mcq' | 'chatbot'>('explanation');
  const [audioStates, setAudioStates] = React.useState<Record<number, { loading: boolean; dataUrl: string | null }>>({});

  const playAudio = async (text: string, index: number) => {
    if (audioStates[index]?.dataUrl) {
      const audio = new Audio(audioStates[index].dataUrl!);
      audio.play();
      return;
    }
    
    setAudioStates(prev => ({ ...prev, [index]: { loading: true, dataUrl: null } }));
    try {
      const result = await textToSpeech(text);
      if (result && result.media) {
        setAudioStates(prev => ({ ...prev, [index]: { loading: false, dataUrl: result.media } }));
        const audio = new Audio(result.media);
        audio.play();
      }
    } catch (error) {
      console.error('TTS Error:', error);
      setAudioStates(prev => ({ ...prev, [index]: { loading: false, dataUrl: null } }));
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl text-primary">{lesson.title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow flex flex-col min-h-0">
            <div className="flex border-b px-6">
                <TabButton icon={<BookOpen />} label="الشرح والأمثلة" isActive={activeTab === 'explanation'} onClick={() => setActiveTab('explanation')} />
                <TabButton icon={<BrainCircuit />} label="اختبر نفسك" isActive={activeTab === 'mcq'} onClick={() => setActiveTab('mcq')} />
                <TabButton icon={<MessageSquare />} label="اسأل الخبير" isActive={activeTab === 'chatbot'} onClick={() => setActiveTab('chatbot')} />
            </div>

            <ScrollArea className="flex-grow p-6">
                {activeTab === 'explanation' && (
                    <div>
                        <h3 className="text-xl font-semibold mb-3">الشرح</h3>
                        <p className="text-muted-foreground mb-6 leading-relaxed">{lesson.explanation}</p>

                        <h3 className="text-xl font-semibold mb-4">أمثلة</h3>
                        <div className="space-y-4">
                            {lesson.examples.map((example, index) => (
                                <Card key={index} className="bg-muted/50">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div>
                                            <p className="font-mono text-left text-base" dir="ltr">{example.english}</p>
                                            <p className="text-sm text-muted-foreground mt-1">{example.arabic}</p>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => playAudio(example.english, index)}
                                            disabled={audioStates[index]?.loading}
                                        >
                                            <Volume2 className="h-5 w-5" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'mcq' && (
                    <div>
                        <h3 className="text-xl font-semibold mb-4">اختبر معلوماتك</h3>
                         <div className="space-y-6">
                            {lesson.mcqs.map((mcq, index) => (
                                <Card key={index} className="bg-muted/50 p-4">
                                    <p className="font-semibold mb-3">{index + 1}. {mcq.question}</p>
                                    <div className="flex flex-col space-y-2">
                                        {mcq.options.map((option, i) => (
                                            <Button key={i} variant="outline" className="justify-start">{option}</Button>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                         </div>
                    </div>
                )}
                {activeTab === 'chatbot' && (
                    <div className="text-center text-muted-foreground pt-10">
                        <MessageSquare className="mx-auto h-12 w-12 mb-4" />
                        <h3 className="text-lg font-semibold">خبير الذكاء الاصطناعي</h3>
                        <p>قريبًا: اطرح أي سؤال حول هذا الدرس.</p>
                    </div>
                )}
            </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}


function TabButton({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                isActive ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
        >
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </button>
    )
}
