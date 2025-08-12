
"use client";

import { useEffect, useState } from 'react';
import type { Lesson } from '@/types/lesson';
import LessonHeader from './LessonHeader';
import ArabicExplanation from './ArabicExplanation';
import LessonExamples from './LessonExamples';
import AdditionalNotes from './AdditionalNotes';
import CommonMistakes from './CommonMistakes';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus } from 'lucide-react';
import LessonTutorModal from './LessonTutorModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useProgressStore } from '@/hooks/use-progress-store';
import { generateFiveMcqFromContent } from '@/ai/flows/generate-lesson-quiz';
import { getItemQuizRag, putItemQuizRag } from '@/lib/rag';

interface LessonDisplayProps {
  lesson: Lesson;
}

interface FiveMcq { question: string; options: string[]; answer: string }

const LessonDisplay = ({ lesson }: LessonDisplayProps) => {
  const [isTutorModalOpen, setIsTutorModalOpen] = useState(false);
  const [quiz, setQuiz] = useState<FiveMcq[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { completeItem } = useProgressStore();

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const id = lesson.title; // stable id per learning item
        const cached = await getItemQuizRag(id);
        if (cached && Array.isArray(cached.quiz) && cached.quiz.length === 5) {
          setQuiz(cached.quiz);
          return;
        }
        // Fallback: use existing lesson mcqs if exactly 5 and shaped the same
        if (Array.isArray((lesson as any).mcqs) && (lesson as any).mcqs.length === 5) {
          setQuiz((lesson as any).mcqs as FiveMcq[]);
          await putItemQuizRag({ id, quiz: (lesson as any).mcqs as FiveMcq[], updated_at: new Date().toISOString() });
          return;
        }
        // Generate via AI
        const generated = await generateFiveMcqFromContent({
          title: lesson.title,
          englishContext: `${lesson.explanation}\n\nExamples:\n${lesson.examples.map(e => `- ${e.english}`).join('\n')}`,
          arabicContext: `${lesson.arabic_explanation || ''}\n\nملاحظات شائعة:\n${lesson.common_mistakes_arabic || ''}`,
        });
        if (generated.length === 5) {
          setQuiz(generated);
          await putItemQuizRag({ id, quiz: generated, updated_at: new Date().toISOString() });
        } else {
          // As a last resort, adapt any existing mcqs to 5 by repeating or truncating
          const base = Array.isArray((lesson as any).mcqs) ? (lesson as any).mcqs : [];
          const padded = [...base];
          while (padded.length < 5 && base.length > 0) padded.push(base[padded.length % base.length]);
          setQuiz(padded.slice(0, 5));
          await putItemQuizRag({ id, quiz: padded.slice(0, 5), updated_at: new Date().toISOString() });
        }
      } catch (err) {
        console.error('Load quiz error', err);
      }
    };
    loadQuiz();
  }, [lesson]);

  const score = isSubmitted ? quiz.reduce((acc, q, i) => (answers[i] === q.answer ? acc + 1 : acc), 0) : 0;
  const passed = score >= 3;

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    if (quiz.length === 5) {
      if (score >= 3) {
        completeItem(lesson.title);
        toast({ title: 'Great job!', description: `You scored ${score}/5. Next lesson unlocked.` });
      } else {
        toast({ variant: 'destructive', title: 'Keep trying', description: `You scored ${score}/5. Get at least 3 correct to continue.` });
      }
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setIsSubmitted(false);
  };

  return (
    <div className="space-y-8 relative pb-20">
      <LessonHeader title={lesson.title} topic={lesson.topic} level={lesson.level} />
      <ArabicExplanation explanation={lesson.arabic_explanation} />
      <LessonExamples examples={lesson.examples} />

      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Quiz (5 questions)</CardTitle>
        </CardHeader>
        <CardContent>
          {isSubmitted && (
            <Alert className={passed ? 'border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-700' : ''}>
              <AlertTitle>{passed ? 'Passed' : 'Try again'}</AlertTitle>
              <AlertDescription>Your score: {score} / {quiz.length}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-6 mt-4">
            {quiz.map((q, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <p className="font-semibold mb-3">{i + 1}. {q.question}</p>
                <RadioGroup value={answers[i]} onValueChange={(val) => !isSubmitted && setAnswers(prev => ({ ...prev, [i]: val }))} disabled={isSubmitted}>
                  {q.options.map((opt, j) => (
                    <div key={j} className="flex items-center space-x-2 rounded-md p-2">
                      <RadioGroupItem value={opt} id={`q${i}-o${j}`} />
                      <Label htmlFor={`q${i}-o${j}`} className="flex-1 cursor-pointer">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {isSubmitted && (
                  <div className="mt-2 text-sm">Correct answer: <strong>{q.answer}</strong></div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-2 justify-end">
            {!isSubmitted && (
              <Button onClick={handleSubmitQuiz} disabled={Object.keys(answers).length !== quiz.length}>Submit Answers</Button>
            )}
            {isSubmitted && !passed && (
              <Button variant="outline" onClick={handleRetry}>Retry</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <AdditionalNotes notes={lesson.additional_notes} notesArabic={lesson.additional_notes_arabic} />
      <CommonMistakes mistakes={lesson.common_mistakes} mistakesArabic={lesson.common_mistakes_arabic} />

      <Button
        onClick={() => setIsTutorModalOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl z-50 p-0"
        aria-label="Open AI Lesson Tutor"
        size="icon"
      >
        <MessageSquarePlus className="h-7 w-7" />
      </Button>

      {isTutorModalOpen && (
        <LessonTutorModal
          isOpen={isTutorModalOpen}
          onClose={() => setIsTutorModalOpen(false)}
          lesson={lesson}
        />
      )}
    </div>
  );
};

export default LessonDisplay;
