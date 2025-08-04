
'use server';
/**
 * @fileOverview This file is no longer used for generating entire lesson structures.
 * The lesson generation logic has been moved to src/app/lessons/[lesson_id]/page.tsx
 * and now uses a direct translation model for better reliability. This file is kept
 * to prevent breaking imports but its core functionality is deprecated.
 */
import { z } from 'zod';

const ExampleSchema = z.object({
    english: z.string().describe('An English example sentence demonstrating the grammar topic.'),
    arabic: z.string().describe('The Arabic translation of the English example sentence.'),
    imagePrompt: z.string().optional(),
    imageUrl: z.string().optional(),
});

export type GenerateLessonContentOutput = z.infer<typeof GenerateLessonContentOutputSchema>;
const GenerateLessonContentOutputSchema = z.object({
  arabicExplanation: z.string().describe('A clear and comprehensive explanation of the English grammar topic, written entirely in Arabic, suitable for the specified student level.'),
  examples: z.array(ExampleSchema).describe('3-5 clear English example sentences illustrating the grammar topic, each with its Arabic translation.'),
  additionalNotesInArabic: z.string().optional().describe('Helpful additional notes related to the grammar topic, written entirely in Arabic, suitable for the student level. This should be a paragraph or two.'),
  commonMistakesInArabic: z.string().optional().describe('Common mistakes Arabic-speaking students make related to this grammar topic, explained entirely in Arabic with examples if appropriate. This should be a paragraph or two.'),
});


export async function generateLessonContent(): Promise<GenerateLessonContentOutput> {
  console.warn("DEPRECATED: generateLessonContent is no longer the primary method for lesson creation.");
  // Return a fallback object to ensure any remaining calls don't crash.
  return {
    arabicExplanation: `عذرًا، حدث خطأ أثناء إنشاء شرح الدرس. يرجى المحاولة مرة أخرى لاحقًا.`,
    examples: [{ english: "Error generating example.", arabic: "خطأ في إنشاء المثال." }],
    additionalNotesInArabic: "خطأ في إنشاء الملاحظات الإضافية.",
    commonMistakesInArabic: "خطأ في إنشاء الأخطاء الشائعة."
  }
}
