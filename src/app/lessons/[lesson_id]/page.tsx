
import type { Metadata } from 'next';
import { lessons } from '@/data/lingo-lessons-data';
import type { Lesson } from '@/types/lesson';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { generateLessonContent } from '@/ai/flows/generate-lesson-content';
import LessonClientComponent from '@/components/lesson/LessonClientComponent';

interface LessonPageProps {
  params: {
    lesson_id: string;
  };
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return lessons.map((lesson) => ({
    lesson_id: lesson.lesson_id,
  }));
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const lesson = lessons.find((l) => l.lesson_id === params.lesson_id);
  if (!lesson) {
    return {
      title: 'Lesson Not Found',
    };
  }
  return {
    title: `${lesson.title} | Lingo Lessons`,
    description: `Learn about ${lesson.topic}: ${lesson.title}. Level: ${lesson.level}.`,
  };
}

async function getLessonData(lessonId: string): Promise<Lesson | null> {
  const baseLessonData = lessons.find((l) => l.lesson_id === lessonId);
  if (!baseLessonData) return null;

  let lesson: Lesson = JSON.parse(JSON.stringify(baseLessonData)); // Deep copy

  if (lesson.meta?.englishGrammarTopic) {
    try {
      const aiContent = await generateLessonContent({
        lessonTitle: lesson.title,
        englishGrammarTopic: lesson.meta.englishGrammarTopic,
        lessonLevel: lesson.level,
        englishAdditionalNotes: lesson.additional_notes, 
        englishCommonMistakes: lesson.common_mistakes, 
      });
      
      lesson.arabic_explanation = aiContent.arabicExplanation;
      lesson.examples = aiContent.examples.map(ex => ({
        english: ex.english,
        arabic: ex.arabic,
        imagePrompt: ex.imagePrompt,
      }));
      lesson.additional_notes_arabic = aiContent.additionalNotesInArabic;
      lesson.common_mistakes_arabic = aiContent.commonMistakesInArabic;
    } catch (error) {
      console.error("Failed to generate AI content for lesson:", lessonId, error);
      const topic = lesson.meta.englishGrammarTopic || "this topic";
      lesson.arabic_explanation = `عذرًا، لم نتمكن من تحميل الشرح التفصيلي لهذا الدرس (${topic}) في الوقت الحالي. يرجى المحاولة مرة أخرى لاحقًا.`;
      lesson.examples = [{ english: "Error loading examples.", arabic: "خطأ في تحميل الأمثلة." }];
      lesson.additional_notes_arabic = "عذرا، لم نتمكن من تحميل الملاحظات الإضافية باللغة العربية حاليا.";
      lesson.common_mistakes_arabic = "عذرا، لم نتمكن من تحميل الأخطاء الشائعة باللغة العربية حاليا.";
    }
  }
  
  return lesson;
}


export default async function LessonPage({ params }: LessonPageProps) {
  const lesson = await getLessonData(params.lesson_id);

  if (!lesson) {
    return (
      <div className="container mx-auto max-w-3xl py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4 text-destructive">Lesson Not Found</h1>
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
