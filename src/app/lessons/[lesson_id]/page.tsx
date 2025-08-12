
import type { Metadata } from 'next';
import { lessons } from '@/data/lingo-lessons-data';
import type { Lesson } from '@/types/lesson';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import LessonClientComponent from '@/components/lesson/LessonClientComponent';
import { translateText } from '@/ai/flows/translate-flow';
import { generateArabicExplanation } from '@/ai/flows/generate-lesson-content';
import { getLessonRag, putLessonRag } from '@/lib/rag';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

interface LessonPageProps {
  params: {
    lesson_id: string;
  };
}

export const dynamicParams = true;

async function getLessonData(lessonId: string): Promise<Lesson | null> {
  const baseLessonData = lessons.find((l) => l.lesson_id === lessonId);
  if (!baseLessonData) return null;

  // 1) Try RAG cache first
  const cached = await getLessonRag(lessonId);
  if (cached) {
    return {
      ...baseLessonData,
      arabic_explanation: cached.arabic_explanation,
      examples: cached.examples,
      additional_notes_arabic: cached.additional_notes_arabic ?? undefined,
      common_mistakes_arabic: cached.common_mistakes_arabic ?? undefined,
    } as Lesson;
  }

  // 2) Generate and persist
  let lesson: Lesson = JSON.parse(JSON.stringify(baseLessonData)); // Deep copy

  try {
    const [
      explanationResponse,
      translatedExamples,
      translatedNotes,
      translatedMistakes
    ] = await Promise.all([
      generateArabicExplanation({ grammarTopic: lesson.meta?.englishGrammarTopic || lesson.title, level: lesson.level }),
      Promise.all(lesson.examples.map(async (ex) => {
        const [_, translatedArabic] = await Promise.all([
          translateText({ text: ex.english, targetLanguage: 'ar', sourceLanguage: 'en' }),
          translateText({ text: ex.arabic, targetLanguage: 'ar', sourceLanguage: 'en' })
        ]);
        return {
          english: ex.english,
          arabic: translatedArabic.translation,
          imagePrompt: ex.imagePrompt
        };
      })),
      lesson.additional_notes ? translateText({ text: lesson.additional_notes, targetLanguage: 'ar', sourceLanguage: 'en' }) : Promise.resolve(null),
      lesson.common_mistakes ? translateText({ text: lesson.common_mistakes, targetLanguage: 'ar', sourceLanguage: 'en' }) : Promise.resolve(null)
    ]);

    lesson.arabic_explanation = explanationResponse.arabicExplanation;
    lesson.examples = translatedExamples;
    lesson.additional_notes_arabic = translatedNotes?.translation;
    lesson.common_mistakes_arabic = translatedMistakes?.translation;

    // Persist to RAG KV for reuse
    await putLessonRag({
      lesson_id: lessonId,
      arabic_explanation: lesson.arabic_explanation,
      examples: lesson.examples,
      additional_notes_arabic: lesson.additional_notes_arabic ?? null,
      common_mistakes_arabic: lesson.common_mistakes_arabic ?? null,
      updated_at: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Failed to generate or translate lesson content:", lessonId, error);
    const topic = lesson.meta?.englishGrammarTopic || "this topic";
    lesson.arabic_explanation = `عذرًا، لم نتمكن من تحميل الشرح التفصيلي لهذا الدرس (${topic}) في الوقت الحالي. يرجى المحاولة مرة أخرى لاحقًا.`;
    lesson.examples = [{ english: "Error loading examples.", arabic: "خطأ في تحميل الأمثلة." }];
    lesson.additional_notes_arabic = "عذرًا، لم نتمكن من تحميل الملاحظات الإضافية باللغة العربية حاليًا.";
    lesson.common_mistakes_arabic = "عذرًا، لم نتمكن من تحميل الأخطاء الشائعة باللغة العربية حاليًا.";
  }

  return lesson;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const lesson = await getLessonData(params.lesson_id);

  if (!lesson) {
    return (
      <div className="container mx-auto max-w-3xl py-8 px-4 text-center">
        <h1 className="text-3xl font-bold text-destructive">Lesson Not Found</h1>
        <p className="text-muted-foreground mb-6">Sorry, we couldn't find the lesson you were looking for.</p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Lessons
          </Link>
        </Button>
      </div>
    );
  }

  return <LessonClientComponent lesson={lesson} />;
}
