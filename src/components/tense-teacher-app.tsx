
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
type CallState = "idle" | "calling" | "active" | "error";
type SpeechLanguage = 'en-US' | 'ar-SA';

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
  const [callState, setCallState] = useState<CallState>("idle");
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const { toast } = useToast();

  const [isListening, setIsListening] = useState(false);
  const [listeningLanguage, setListeningLanguage] = useState<SpeechLanguage | null>(null);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(true);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([]);
  const [selectedTense, setSelectedTense] = useState<string>("");


  const ahmedForm = useForm<AhmedFormData>({
    resolver: zodResolver(ahmedSchema),
    defaultValues: { englishGrammarConcept: "" },
  });

  const saraForm = useForm<SaraFormData>({
    resolver: zodResolver(saraSchema),
    defaultValues: { englishGrammarConcept: "", userLanguageProficiency: "" },
  });

  // Effect to reset state when teacher changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    if (speechRecognitionRef.current && isListening) {
      speechRecognitionRef.current.abort();
      setIsListening(false);
      setListeningLanguage(null);
    }
    setCallState("idle");
    setExplanation(null);
    setConversationHistory([]); 
    setSelectedTense("");
    ahmedForm.reset({ englishGrammarConcept: "" });
    saraForm.reset({ englishGrammarConcept: "", userLanguageProficiency: "" });
    ahmedForm.clearErrors();
    saraForm.clearErrors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTeacher]);

  const handlePlayAudio = async (text: string, lang: 'ar-SA' | 'en-US') => {
      try {
        const result = await textToSpeech(text);
        if (result && result.media) {
            const audio = new Audio(result.media);
            audio.play();
        } else {
            toast({
              title: "TTS Error",
              description: "Could not generate audio.",
              variant: "destructive",
            });
        }
      } catch (error) {
          console.error("TTS Error:", error);
          toast({
            title: "TTS Error",
            description: "An unexpected error occurred.",
            variant: "destructive",
          });
      }
  };

  const commonSubmitLogic = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    if (speechRecognitionRef.current && isListening) {
      speechRecognitionRef.current.abort();
      setIsListening(false);
      setListeningLanguage(null);
    }
    setCallState("calling");
    setExplanation(null);
  };
  
  const handleAhmedSubmit: SubmitHandler<AhmedFormData> = async (data) => {
    commonSubmitLogic();
    try {
      const input: AhmedVoiceCallInput = { 
        ...data, 
        conversationHistory: conversationHistory 
      };
      const result = await ahmedVoiceCall(input);
      setExplanation(result.explanation);
      setCallState("active");
      
      const userEntry: ConversationEntry = { speaker: 'User', message: data.englishGrammarConcept };
      const aiEntry: ConversationEntry = { speaker: 'Ahmed', message: result.explanation };
      setConversationHistory(prev => [...prev, userEntry, aiEntry].slice(- (MAX_HISTORY_PAIRS * 2)));
      ahmedForm.reset({ englishGrammarConcept: "" }); // Clear input after submit

      toast({
        title: "تم استلام الشرح",
        description: "أحمد قدم شرحًا.",
      });

      if (!isMuted) {
        handlePlayAudio(result.explanation, 'ar-SA');
      }

    } catch (error) {
      console.error("Error calling Ahmed:", error);
      toast({
        variant: "destructive",
        title: "خطأ في الاتصال بأحمد",
        description: "فشل الحصول على شرح من أحمد. يرجى المحاولة مرة أخرى.",
      });
      setCallState("error");
    }
  };

  const handleSaraSubmit: SubmitHandler<SaraFormData> = async (data) => {
    commonSubmitLogic();
    try {
      const input: SaraVoiceCallInput = { 
        ...data, 
        conversationHistory: conversationHistory 
      };
      const result = await saraVoiceCall(input);
      setExplanation(result.explanation);
      setCallState("active");

      const userEntry: ConversationEntry = { speaker: 'User', message: data.englishGrammarConcept };
      const aiEntry: ConversationEntry = { speaker: 'Sara', message: result.explanation };
      setConversationHistory(prev => [...prev, userEntry, aiEntry].slice(- (MAX_HISTORY_PAIRS * 2)));
      saraForm.reset({ ...saraForm.getValues(), englishGrammarConcept: "" }); // Clear input

       toast({
        title: "تم استلام الشرح",
        description: "سارة قدمت شرحًا.",
      });
      if (!isMuted) {
        handlePlayAudio(result.explanation, 'ar-SA');
      }
    } catch (error) {
      console.error("Error calling Sara:", error);
      toast({
        variant: "destructive",
        title: "خطأ في الاتصال بسارة",
        description: "فشل الحصول على شرح من سارة. يرجى المحاولة مرة أخرى.",
      });
      setCallState("error");
    }
  };

  // Trigger AI call when a tense is selected from dropdown
  useEffect(() => {
    if (selectedTense) {
        const currentForm = selectedTeacher === 'Ahmed' ? ahmedForm : saraForm;
        currentForm.setValue('englishGrammarConcept', selectedTense);
        const values = currentForm.getValues();
        
        // Ensure proficiency is set for Sara before submitting
        if (selectedTeacher === 'Sara' && !(values as SaraFormData).userLanguageProficiency) {
            toast({
                title: "مطلوب مستوى الإتقان",
                description: "يرجى إدخال مستوى إتقانك للغة الإنجليزية قبل اختيار زمن.",
                variant: "destructive"
            });
            setSelectedTense(""); // Reset selection
            return;
        }

        currentForm.handleSubmit(selectedTeacher === 'Ahmed' ? handleAhmedSubmit : handleSaraSubmit)();
        setSelectedTense(""); // Reset dropdown after triggering
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTense, selectedTeacher]);

  const endCall = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    if (speechRecognitionRef.current && isListening) {
      speechRecognitionRef.current.abort();
      setIsListening(false);
      setListeningLanguage(null);
    }
    setCallState("idle");
    setExplanation(null);
    setConversationHistory([]);
    setSelectedTense("");
    if (selectedTeacher === "Ahmed") ahmedForm.reset();
    if (selectedTeacher === "Sara") saraForm.reset();
  };

  const toggleMute = () => {
    setIsMuted(prevMuted => {
      const newMutedState = !prevMuted;
      if (newMutedState && typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return newMutedState;
    });
  };

  const teacherDetails = {
    Ahmed: {
      name: "أحمد",
      avatarSrc: "https://placehold.co/128x128/3498db/ffffff.png",
      avatarHint: "male teacher",
      description: "معلم ذكاء اصطناعي يقدم شروحات باللغة العربية لقواعد اللغة الإنجليزية.",
      onSubmit: handleAhmedSubmit,
    },
    Sara: {
      name: "سارة",
      avatarSrc: "https://placehold.co/128x128/e91e63/ffffff.png",
      avatarHint: "female teacher",
      description: "معلمة ذكاء اصطناعي تصمم شروحات باللغة العربية لقواعد اللغة الإنجليزية لتناسب مستوى إتقانك.",
      onSubmit: handleSaraSubmit,
    },
  };

  const currentTeacherInfo = teacherDetails[selectedTeacher];
  const currentForm = selectedTeacher === 'Ahmed' ? ahmedForm : saraForm;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = currentForm;

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <ScrollArea className="flex-grow">
        <div className="flex flex-col items-center justify-start min-h-full p-4 sm:p-8 pt-12 sm:pt-16">
          <header className="mb-10 text-center">
            <MessageSquareQuote className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-primary mb-4 animate-pulse" />
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">خبير الأزمنة</h1>
            <p className="text-lg sm:text-xl text-muted-foreground mt-2">
              معلموك الذكاء الاصطناعي لإتقان قواعد اللغة الإنجليزية، مع شرح باللغة العربية.
            </p>
          </header>

          <Card className="w-full max-w-2xl shadow-xl overflow-hidden bg-card">
            <CardHeader className="text-center p-6 bg-muted/30 relative">
              <div className="flex justify-center mb-4">
                  <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-2 sm:border-4 border-primary shadow-lg">
                    <Image 
                      src={currentTeacherInfo.avatarSrc} 
                      alt={currentTeacherInfo.name} 
                      width={128} 
                      height={128} 
                      data-ai-hint={currentTeacherInfo.avatarHint}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-3xl sm:text-4xl">{selectedTeacher.charAt(0)}</AvatarFallback>
                  </Avatar>
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-semibold text-foreground">{currentTeacherInfo.name}</CardTitle>
              <CardDescription className="text-muted-foreground mt-1 text-sm sm:text-base">{currentTeacherInfo.description}</CardDescription>
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="absolute top-4 rtl:left-4 ltr:right-4 text-muted-foreground hover:text-primary"
                  aria-label={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
                >
                  {isMuted ? <VolumeX className="h-5 w-5 sm:h-6 sm:w-6" /> : <Volume2 className="h-5 w-5 sm:h-6 sm:w-6" />}
                </Button>
            </CardHeader>

            <Tabs value={selectedTeacher} onValueChange={(value) => setSelectedTeacher(value as Teacher)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-none h-auto">
                <TabsTrigger value="Ahmed" className="py-3 sm:py-4 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-none">
                  <User className="ms-2 h-4 w-4 sm:h-5 sm:w-5" /> أحمد
                </TabsTrigger>
                <TabsTrigger value="Sara" className="py-3 sm:py-4 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-none">
                  <User className="ms-2 h-4 w-4 sm:h-5 sm:w-5" /> سارة
                </TabsTrigger>
              </TabsList>

              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <form onSubmit={handleSubmit(currentTeacherInfo.onSubmit as SubmitHandler<any>)} className="space-y-4 sm:space-y-6">
                  
                  {selectedTeacher === "Sara" && (
                    <div>
                      <Label htmlFor="userLanguageProficiency" className="text-sm sm:text-md font-medium">مستوى إتقانك للغة الإنجليزية</Label>
                      <Input
                        id="userLanguageProficiency"
                        placeholder="مثال: مبتدئ، متوسط، متقدم"
                        {...register("userLanguageProficiency")}
                        className={`mt-2 text-base bg-background focus:ring-2 focus:ring-primary ${errors.userLanguageProficiency ? 'border-destructive focus:ring-destructive' : 'border-border'}`}
                        disabled={callState === "calling" || isSubmitting}
                      />
                      {errors.userLanguageProficiency && <p className="text-xs sm:text-sm text-destructive mt-1">{errors.userLanguageProficiency.message}</p>}
                    </div>
                  )}

                  <div>
                     <Label htmlFor="tense-select" className="text-sm sm:text-md font-medium">اختر زمناً ليبدأ الشرح</Label>
                     <Select value={selectedTense} onValueChange={setSelectedTense} disabled={callState === "calling" || isSubmitting}>
                         <SelectTrigger id="tense-select" className="mt-2 text-base">
                             <SelectValue placeholder="اختر زمناً من القائمة..."/>
                         </SelectTrigger>
                         <SelectContent>
                             {TENSES_LIST.map(tense => (
                                 <SelectItem key={tense} value={tense}>{tense}</SelectItem>
                             ))}
                         </SelectContent>
                     </Select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label htmlFor="englishGrammarConcept" className="text-sm sm:text-md font-medium">أو اطرح سؤالاً للمتابعة</Label>
                    </div>
                    <div className="flex gap-2">
                        <Textarea
                          id="englishGrammarConcept"
                          placeholder={
                            isListening 
                            ? `جاري الاستماع ${listeningLanguage === 'en-US' ? ' بالإنجليزية' : listeningLanguage === 'ar-SA' ? ' بالعربية' : ''}...` 
                            : "اكتب سؤال متابعة هنا..."
                          }
                          {...register("englishGrammarConcept")}
                          className={`mt-1 text-base bg-background focus:ring-2 focus:ring-primary ${errors.englishGrammarConcept ? 'border-destructive focus:ring-destructive' : 'border-border'}`}
                          rows={2}
                          disabled={callState === "calling" || isSubmitting || isListening}
                        />
                         <Button type="submit" size="icon" className="h-auto px-3" disabled={isSubmitting || isListening}>
                            <Send className="h-5 w-5"/>
                         </Button>
                    </div>
                    {errors.englishGrammarConcept && <p className="text-xs sm:text-sm text-destructive mt-1">{errors.englishGrammarConcept.message}</p>}
                  </div>
                  
                  <div className="pt-2 flex justify-center">
                    {callState === "active" && (
                        <Button type="button" onClick={endCall} variant="outline" className="w-full max-w-xs py-2.5 sm:py-3 text-base sm:text-lg border-destructive text-destructive hover:bg-destructive/10 rounded-md shadow-sm">
                            <PhoneOff className="ms-2 h-4 w-4 sm:h-5 sm:w-5" /> إنهاء المحادثة
                        </Button>
                    )}
                  </div>
                </form>

                 {(callState === "active" || callState === "calling") && (
                    <ScrollArea className="h-64 mt-4 sm:mt-6 p-4 bg-secondary/30 rounded-lg shadow-inner border border-border">
                        <div className="space-y-4">
                           {conversationHistory.map((entry, index) => (
                               <div key={index} className={`flex items-start gap-2 ${entry.speaker === 'User' ? 'justify-end' : 'justify-start'}`}>
                                   {entry.speaker !== 'User' && <Avatar className="h-6 w-6"><AvatarImage src={currentTeacherInfo.avatarSrc} /><AvatarFallback>{entry.speaker.charAt(0)}</AvatarFallback></Avatar>}
                                   <div className={`rounded-lg px-3 py-2 max-w-[85%] ${entry.speaker === 'User' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                                        <p className="text-sm whitespace-pre-wrap">{entry.message}</p>
                                   </div>
                                    {entry.speaker === 'User' && <Avatar className="h-6 w-6"><AvatarFallback>U</AvatarFallback></Avatar>}
                               </div>
                           ))}
                           {callState === "calling" && (
                                <div className="flex items-center gap-2">
                                     <Avatar className="h-6 w-6"><AvatarImage src={currentTeacherInfo.avatarSrc} /><AvatarFallback>{selectedTeacher.charAt(0)}</AvatarFallback></Avatar>
                                     <div className="rounded-lg px-3 py-2 bg-card">
                                        <Loader2 className="h-4 w-4 animate-spin"/>
                                     </div>
                                </div>
                           )}
                        </div>
                    </ScrollArea>
                )}
                {callState === "error" && (
                  <div className="mt-4 sm:mt-6 p-4 bg-destructive/10 text-destructive rounded-lg shadow-inner border border-destructive/30 flex items-center gap-2 sm:gap-3">
                    <AlertTriangle className="h-6 w-6 sm:h-8 sm:h-8 flex-shrink-0" />
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold">فشل الاتصال</h3>
                      <p className="text-xs sm:text-sm">تعذر الاتصال بـ {currentTeacherInfo.name}. يرجى المحاولة مرة أخرى.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Tabs>
          </Card>

          <footer className="mt-8 sm:mt-12 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} لينجوا ليرن الثنائي الذكاء الاصطناعي. مقدم من سبيد أوف ماستري.</p>
          </footer>
        </div>
      </ScrollArea>
    </div>
  );
}
