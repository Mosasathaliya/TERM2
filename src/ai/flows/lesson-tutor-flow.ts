
'use server';
/**
 * @fileOverview Provides AI-powered tutoring assistance for specific lesson content.
 *
 * - getLessonTutorResponse - A function that provides an AI response to a student's question about a lesson.
 * - LessonTutorInput - The input type for the getLessonTutorResponse function.
 * - LessonTutorOutput - The return type for the getLessonTutorResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import type { LessonExample } from '@/types/lesson';

const LessonTutorInputSchema = z.object({
  studentQuestion: z.string().describe('The question asked by the student.'),
  lessonTitle: z.string().describe('The title of the lesson.'),
  lessonTopic: z.string().describe('The topic of the lesson.'),
  lessonLevel: z.string().describe('The level of the lesson (e.g., Beginner, Intermediate, Advanced).'),
  lessonArabicExplanation: z.string().describe('The Arabic explanation of the lesson.'),
  lessonExamples: z.array(
    z.object({
      english: z.string().describe('The English example.'),
      arabic: z.string().describe('The Arabic translation of the example.'),
      imagePrompt: z.string().optional(),
      imageUrl: z.string().optional(),
    })
  ).describe('Examples provided in the lesson.'),
  lessonAdditionalNotesArabic: z.string().optional().describe('Additional notes for the lesson in Arabic.'),
  lessonCommonMistakesArabic: z.string().optional().describe('Common mistakes students make in the lesson in Arabic.'),
});

export type LessonTutorInput = z.infer<typeof LessonTutorInputSchema>;

const LessonTutorOutputSchema = z.object({
  aiTutorResponse: z.string().describe('The AI tutor\'s response to the student\'s question, in Arabic.'),
});

export type LessonTutorOutput = z.infer<typeof LessonTutorOutputSchema>;

export async function getLessonTutorResponse(input: LessonTutorInput): Promise<LessonTutorOutput> {
  return lessonTutorFlow(input);
}

const tutorPrompt = ai.definePrompt({
  name: 'lessonTutorPrompt',
  input: {schema: LessonTutorInputSchema},
  output: {schema: LessonTutorOutputSchema},
  prompt: `أنت معلم لغة إنجليزية ذكاء اصطناعي متخصص في مساعدة الطلاب الناطقين بالعربية.
الطالب يدرس حاليًا درسًا بعنوان "{{lessonTitle}}" حول موضوع "{{lessonTopic}}" للمستوى "{{lessonLevel}}".
الشرح الأساسي للدرس باللغة العربية هو: "{{lessonArabicExplanation}}"
أمثلة الدرس تشمل:
{{#each lessonExamples}}
- الإنجليزية: "{{this.english}}"، العربية: "{{this.arabic}}"
{{/each}}
{{#if lessonAdditionalNotesArabic}}
ملاحظات إضافية باللغة العربية: "{{lessonAdditionalNotesArabic}}"
{{/if}}
{{#if lessonCommonMistakesArabic}}
أخطاء شائعة باللغة العربية: "{{lessonCommonMistakesArabic}}"
{{/if}}

سؤال الطالب هو: "{{studentQuestion}}"

مهمتك هي تقديم إجابة واضحة ومفيدة وموجزة لسؤال الطالب **باللغة العربية فقط**.
استشهد بمواد الدرس (الشرح أو الأمثلة) إذا كان ذلك مناسبًا لتعزيز الفهم.
كن مشجعًا وصبورًا. إذا كان السؤال غير واضح، يمكنك أن تطلب بأدب من الطالب تقديم المزيد من التفاصيل، ولكن حاول الإجابة قدر الإمكان أولاً.
تجنب استخدام اللغة الإنجليزية تمامًا في ردك، إلا إذا كان السؤال يتعلق تحديدًا بمصطلح إنجليزي لا يمكن ترجمته بسهولة دون فقدان المعنى (وفي هذه الحالة، اشرح المصطلح باللغة العربية).
يجب أن يكون ردك كاملاً وجاهزًا للعرض للطالب.
`,
});

const lessonTutorFlow = ai.defineFlow(
  {
    name: 'lessonTutorFlow',
    inputSchema: LessonTutorInputSchema,
    outputSchema: LessonTutorOutputSchema,
  },
  async (input) => {
    const {output} = await tutorPrompt(input);
    if (!output) {
      throw new Error('AI tutor failed to generate a response.');
    }
    return output;
  }
);
