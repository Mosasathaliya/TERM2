
"use client";

import { useState, useEffect, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';

import { ahmedVoiceCall, type AhmedVoiceCallInput } from '@/ai/flows/ahmed-voice-call';
import { saraVoiceCall, type SaraVoiceCallInput } from '@/ai/flows/sara-voice-call';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, PhoneOff, User, MessageCircle, Mic, AlertTriangle, Volume2, VolumeX, MicOff, MessageSquareQuote, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { textToSpeech } from '@/ai/flows/tts-flow';
import { ScrollArea } from './ui/scroll-area';


const ahmedSchema = z.object({
  englishGrammarConcept: z.string().min(3, { message: "يرجى إدخال مفهوم قواعدي (3 أحرف على الأقل)." }),
});
type AhmedFormData = z.infer<typeof ahmedSchema>;

const saraSchema = z.object({
  englishGrammarConcept: z.string().min(3, { message: "يرجى إدخال مفهوم قواعدي (3 أحرف على الأقل)." }),
  userLanguageProficiency: z.string().min(2, { message: "يرجى وصف مستوى إتقانك (حرفان على الأقل)." }),
});
type SaraFormData = z.infer<typeof saraSchema>;

type Teacher = "Ahmed" | "Sara";
export interface ConversationEntry {
  speaker: 'User' | 'Ahmed' | 'Sara';
  message: string;
}

const MAX_HISTORY_PAIRS = 15; // 15 pairs = 30 entries (user + AI)

const TENSES_LIST = [
    "Present Simple", "Present Continuous", "Present Perfect", "Present Perfect Continuous",
    "Past Simple", "Past Continuous", "Past Perfect", "Past Perfect Continuous",
    "Future Simple", "Future Continuous", "Future Perfect", "Future Perfect Continuous",
    "Zero Conditional", "First Conditional", "Second Conditional", "Third Conditional", "Mixed Conditionals",
    "Passive Voice (Present)", "Passive Voice (Past)", "Passive Voice (Future)"
];

export function TenseTeacherApp() {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher>("Ahmed");
  const [isCalling, setIsCalling] = useState(false);
  const { toast } = useToast();
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const ahmedForm = useForm<AhmedFormData>({
    resolver: zodResolver(ahmedSchema),
    defaultValues: { englishGrammarConcept: "" },
  });

  const saraForm = useForm<SaraFormData>({
    resolver: zodResolver(saraSchema),
    defaultValues: { englishGrammarConcept: "", userLanguageProficiency: "" },
  });

  const currentForm = selectedTeacher === 'Ahmed' ? ahmedForm : saraForm;
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = currentForm;

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversationHistory]);

  const handlePlayAudio = async (text: string) => {
      try {
        const result = await textToSpeech(text);
        if (result && result.media) {
            const audio = new Audio(result.media);
            audio.play();
        }
      } catch (error) {
          console.error("TTS Error:", error);
      }
  };
  
  const onSubmit = async (data: AhmedFormData | SaraFormData) => {
    setIsCalling(true);
    const userMessage = data.englishGrammarConcept;
    const newHistory: ConversationEntry[] = [...conversationHistory, { speaker: 'User', message: userMessage }];
    setConversationHistory(newHistory);
    setValue('englishGrammarConcept', '');

    try {
        let result;
        if (selectedTeacher === 'Ahmed') {
            const input: AhmedVoiceCallInput = {
                englishGrammarConcept: userMessage,
                conversationHistory: conversationHistory,
            };
            result = await ahmedVoiceCall(input);
        } else {
             const saraData = data as SaraFormData;
             const input: SaraVoiceCallInput = {
                englishGrammarConcept: userMessage,
                userLanguageProficiency: saraData.userLanguageProficiency || 'Intermediate',
                conversationHistory: conversationHistory,
            };
            result = await saraVoiceCall(input);
        }

        const aiEntry: ConversationEntry = { speaker: selectedTeacher, message: result.explanation };
        setConversationHistory(prev => [...prev, aiEntry].slice(- (MAX_HISTORY_PAIRS * 2)));
        handlePlayAudio(result.explanation);
    } catch (error) {
        console.error(`Error calling ${selectedTeacher}:`, error);
        toast({
            variant: "destructive",
            title: "فشل الاتصال",
            description: `تعذر الاتصال بـ ${selectedTeacher}. يرجى المحاولة مرة أخرى.`,
        });
        // Remove the user's message if the call fails
        setConversationHistory(prev => prev.slice(0, -1));
    } finally {
        setIsCalling(false);
    }
  };
  
  const handleTenseSelection = (tense: string) => {
    if(tense) {
        setValue('englishGrammarConcept', `Explain ${tense}`);
    }
  };

  const teacherDetails = {
    Ahmed: {
      name: "أحمد",
      avatarSrc: "https://placehold.co/128x128/3498db/ffffff.png",
      avatarHint: "male teacher",
      onSubmit: onSubmit,
    },
    Sara: {
      name: "سارة",
      avatarSrc: "https://placehold.co/128x128/e91e63/ffffff.png",
      avatarHint: "female teacher",
      onSubmit: onSubmit,
    },
  };

  const currentTeacherInfo = teacherDetails[selectedTeacher];

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
        <header className="mb-4 text-center pt-8 sm:pt-16">
            <MessageSquareQuote className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-primary mb-4 animate-pulse" />
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">خبير الأزمنة</h1>
            <p className="text-lg sm:text-xl text-muted-foreground mt-2">
                معلموك الذكاء الاصطناعي لإتقان قواعد اللغة الإنجليزية، مع شرح باللغة العربية.
            </p>
        </header>

        <div className="flex-grow px-4 pb-4 w-full max-w-2xl mx-auto flex flex-col min-h-0">
             <Tabs value={selectedTeacher} onValueChange={(value) => setSelectedTeacher(value as Teacher)} className="w-full bg-card rounded-t-lg shadow-xl overflow-hidden shrink-0">
                <TabsList className="grid w-full grid-cols-2 rounded-none h-auto">
                    <TabsTrigger value="Ahmed" className="py-3 sm:py-4 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-none">
                        <User className="ms-2 h-4 w-4 sm:h-5 sm:w-5" /> أحمد
                    </TabsTrigger>
                    <TabsTrigger value="Sara" className="py-3 sm:py-4 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-none">
                        <User className="ms-2 h-4 w-4 sm:h-5 sm:w-5" /> سارة
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            
            <Card className="w-full shadow-xl bg-card rounded-t-none flex flex-col flex-grow min-h-0">
                <CardContent className="p-4 sm:p-6 space-y-4 flex flex-col flex-grow min-h-0">
                    <ScrollArea className="flex-grow h-64 border rounded-md bg-background">
                        <div ref={chatContainerRef} className="p-2 space-y-4">
                            {conversationHistory.length > 0 ? (
                                conversationHistory.map((entry, index) => (
                                    <div key={index} className={`flex items-start gap-2 ${entry.speaker === 'User' ? 'justify-end' : 'justify-start'}`}>
                                        {entry.speaker !== 'User' && <Avatar className="h-6 w-6"><AvatarImage src={currentTeacherInfo.avatarSrc} /><AvatarFallback>{entry.speaker.charAt(0)}</AvatarFallback></Avatar>}
                                        <div className={`rounded-lg px-3 py-2 max-w-[85%] ${entry.speaker === 'User' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                            <p className="text-sm whitespace-pre-wrap">{entry.message}</p>
                                        </div>
                                        {entry.speaker === 'User' && <Avatar className="h-6 w-6"><AvatarFallback>U</AvatarFallback></Avatar>}
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
                                    <MessageCircle className="h-10 w-10 mb-2" />
                                    <p>ابدأ المحادثة باختيار موضوع أو طرح سؤال أدناه.</p>
                                </div>
                            )}
                            {isCalling && (
                                <div className="flex items-start gap-2 justify-start">
                                    <Avatar className="h-6 w-6"><AvatarImage src={currentTeacherInfo.avatarSrc} /><AvatarFallback>{selectedTeacher.charAt(0)}</AvatarFallback></Avatar>
                                    <div className="rounded-lg px-3 py-2 bg-muted flex items-center">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <form onSubmit={handleSubmit(onSubmit as SubmitHandler<any>)} className="space-y-3 pt-4 border-t shrink-0">
                        {selectedTeacher === "Sara" && conversationHistory.length === 0 && (
                            <div>
                                <Label htmlFor="userLanguageProficiency" className="text-sm sm:text-md font-medium">مستوى إتقانك للغة الإنجليزية</Label>
                                <Input id="userLanguageProficiency" placeholder="مثال: مبتدئ، متوسط، متقدم" {...register("userLanguageProficiency")}
                                    className={`mt-1 text-base bg-background focus:ring-2 focus:ring-primary ${errors.userLanguageProficiency ? 'border-destructive focus:ring-destructive' : 'border-border'}`}
                                    disabled={isSubmitting} />
                                {errors.userLanguageProficiency && <p className="text-xs sm:text-sm text-destructive mt-1">{errors.userLanguageProficiency.message}</p>}
                            </div>
                        )}
                        <div>
                            <Label htmlFor="tense-select" className="text-sm sm:text-md font-medium">اختر زمناً ليبدأ الشرح</Label>
                            <Select onValueChange={handleTenseSelection} disabled={isSubmitting}>
                                <SelectTrigger id="tense-select" className="mt-1 text-base">
                                    <SelectValue placeholder="اختر زمناً من القائمة..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {TENSES_LIST.map(tense => ( <SelectItem key={tense} value={tense}>{tense}</SelectItem> ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="englishGrammarConcept" className="text-sm sm:text-md font-medium">أو اطرح سؤالاً للمتابعة</Label>
                            <div className="flex gap-2 mt-1">
                                <Textarea id="englishGrammarConcept" placeholder="اكتب سؤال متابعة هنا..." {...register("englishGrammarConcept")}
                                    className={`text-base bg-background focus:ring-2 focus:ring-primary ${errors.englishGrammarConcept ? 'border-destructive focus:ring-destructive' : 'border-border'}`}
                                    rows={1} disabled={isSubmitting} />
                                <Button type="submit" size="icon" className="h-auto px-3 shrink-0" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin"/> : <Send className="h-5 w-5" />}
                                </Button>
                            </div>
                            {errors.englishGrammarConcept && <p className="text-xs sm:text-sm text-destructive mt-1">{errors.englishGrammarConcept.message}</p>}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

    