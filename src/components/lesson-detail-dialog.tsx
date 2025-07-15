
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Volume2, MessageSquare, BookOpen, BrainCircuit, Send, User, Bot, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import type { LearningItem, Lesson, Story } from '@/lib/lessons';
import { textToSpeech } from '@/ai/flows/tts-flow';
import { expertChat, type ExpertChatInput } from '@/ai/flows/expert-chat-flow';
import { generateStoryImage } from '@/ai/flows/story-image-flow';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

interface LessonDetailDialogProps {
  item: LearningItem;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

function Chatbot({ lesson }: { lesson: Lesson }) {
    const [history, setHistory] = React.useState<Message[]>([]);
    const [input, setInput] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const { toast } = useToast();
    const scrollAreaRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div');
            if (viewport) {
                viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
            }
        }
    }, [history]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const newUserMessage: Message = { role: 'user', content: input };
        const newHistory = [...history, newUserMessage];
        setHistory(newHistory);
        setInput('');
        setIsLoading(true);

        try {
            const chatInput: ExpertChatInput = {
                lessonTitle: lesson.title,
                lessonExplanation: lesson.explanation,
                history: newHistory.slice(0, -1), // Send history without the latest user message
                question: input,
            };
            const result = await expertChat(chatInput);
            const aiMessage: Message = { role: 'model', content: result.answer };
            setHistory(prev => [...prev, aiMessage]);
        } catch (error)
        {
            console.error('Expert chat error:', error);
            toast({
                variant: "destructive",
                title: "حدث خطأ",
                description: "لم نتمكن من الحصول على رد من الخبير. الرجاء المحاولة مرة أخرى.",
            });
            setHistory(prev => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                     {history.length === 0 && (
                        <div className="text-center text-muted-foreground pt-10">
                            <Bot className="mx-auto h-12 w-12 mb-4" />
                            <h3 className="text-lg font-semibold">خبير الذكاء الاصطناعي</h3>
                            <p>اطرح أي سؤال حول "{lesson.title}".</p>
                        </div>
                    )}
                    {history.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && <Bot className="h-6 w-6 text-primary flex-shrink-0" />}
                            <div className={`rounded-lg p-3 max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            </div>
                            {msg.role === 'user' && <User className="h-6 w-6 flex-shrink-0" />}
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-3">
                            <Bot className="h-6 w-6 text-primary flex-shrink-0" />
                            <div className="rounded-lg p-3 bg-muted">
                                <div className="flex items-center space-x-2" dir="rtl">
                                    <div className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                    <div className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                    <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
            <div className="p-4 border-t flex items-center gap-2">
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="اكتب سؤالك هنا..."
                    rows={1}
                    className="w-full p-2 rounded-md focus:ring-2 focus:ring-primary outline-none transition resize-none"
                    disabled={isLoading}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                />
                <Button size="icon" onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
                    <Send className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}

function StoryReader({ story }: { story: Story }) {
    const [imageUrl, setImageUrl] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const { toast } = useToast();

    const handleGenerateImage = async () => {
        setIsLoading(true);
        try {
            const result = await generateStoryImage({ story: story.content });
            setImageUrl(result.imageUrl);
        } catch (error) {
            console.error('Image generation error:', error);
            toast({
                variant: 'destructive',
                title: 'فشل إنشاء الصورة',
                description: 'حدث خطأ أثناء إنشاء الصورة. الرجاء المحاولة مرة أخرى.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollArea className="h-full">
            <div className="p-6">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap mb-6">{story.content}</p>
                
                {!imageUrl && !isLoading && (
                    <Button onClick={handleGenerateImage}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        تخيل القصة
                    </Button>
                )}

                {isLoading && (
                    <div className="flex items-center justify-center p-4 rounded-md bg-muted">
                        <div className="flex items-center space-x-2" dir="rtl">
                            <div className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                            <div className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                            <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                            <span className="text-muted-foreground mr-2">...يتم إنشاء الصورة</span>
                        </div>
                    </div>
                )}
                
                {imageUrl && (
                    <div className="mt-4 border rounded-lg overflow-hidden">
                        <Image
                            src={imageUrl}
                            alt={`Illustration for ${story.title}`}
                            width={500}
                            height={500}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                )}
            </div>
        </ScrollArea>
    );
}


export function LessonDetailDialog({ item, isOpen, onClose }: LessonDetailDialogProps) {
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
        <DialogHeader className="p-6 pb-2 border-b">
          <DialogTitle className="text-2xl text-primary">{item.title}</DialogTitle>
        </DialogHeader>
        
        {item.type === 'lesson' && (
            <>
                <div className="flex border-b px-6">
                    <TabButton icon={<BookOpen />} label="الشرح والأمثلة" isActive={activeTab === 'explanation'} onClick={() => setActiveTab('explanation')} />
                    <TabButton icon={<BrainCircuit />} label="اختبر نفسك" isActive={activeTab === 'mcq'} onClick={() => setActiveTab('mcq')} />
                    <TabButton icon={<MessageSquare />} label="اسأل الخبير" isActive={activeTab === 'chatbot'} onClick={() => setActiveTab('chatbot')} />
                </div>
                 <div className="flex-grow min-h-0">
                    {activeTab === 'explanation' && (
                        <ScrollArea className="h-full">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-3">الشرح</h3>
                                <p className="text-muted-foreground mb-6 leading-relaxed whitespace-pre-wrap">{item.explanation}</p>

                                <h3 className="text-xl font-semibold mb-4">أمثلة</h3>
                                <div className="space-y-4">
                                    {item.examples.map((example, index) => (
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
                        </ScrollArea>
                    )}
                    {activeTab === 'mcq' && (
                        <ScrollArea className="h-full">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-4">اختبر معلوماتك</h3>
                                <div className="space-y-6">
                                    {item.mcqs.map((mcq, index) => (
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
                        </ScrollArea>
                    )}
                    {activeTab === 'chatbot' && (
                        <Chatbot lesson={item} />
                    )}
                </div>
            </>
        )}
        {item.type === 'story' && <StoryReader story={item} />}
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
