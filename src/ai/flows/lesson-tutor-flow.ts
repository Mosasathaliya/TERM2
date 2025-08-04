'use server';
/**
 * @fileOverview Provides AI-powered tutoring assistance for specific lesson content.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export type LessonTutorInput = z.infer<typeof LessonTutorInputSchema>;
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

export type LessonTutorOutput = z.infer<typeof LessonTutorOutputSchema>;
const LessonTutorOutputSchema = z.object({
  aiTutorResponse: z.string().describe('The AI tutor\'s response to the student\'s question, in Arabic.'),
});

const lessonTutorPrompt = ai.definePrompt(
    {
      name: 'lessonTutorPrompt',
      input: { schema: LessonTutorInputSchema },
      output: { schema: LessonTutorOutputSchema },
      prompt: `You are a specialist AI English language tutor for Arabic-speaking students. 
Your entire response MUST be in Arabic.
Your personality is encouraging and patient.

The student is studying a lesson titled "{{lessonTitle}}" on the topic of "{{lessonTopic}}" at the "{{lessonLevel}}" level.

Here is the core lesson material you must use to answer the question:
---
Lesson Explanation (in Arabic): "{{lessonArabicExplanation}}"
---
Lesson Examples:
{{#each lessonExamples}}- English: "{{english}}", Arabic: "{{arabic}}"
{{/each}}
---
{{#if lessonAdditionalNotesArabic}}Additional Notes (in Arabic): "{{lessonAdditionalNotesArabic}}"\n---{{/if}}
{{#if lessonCommonMistakesArabic}}Common Mistakes (in Arabic): "{{lessonCommonMistakesArabic}}"\n---{{/if}}

The student's question is: "{{studentQuestion}}"

Your task is to provide a clear, helpful, and concise answer to the student's question **in Arabic only**.
Refer to the lesson material provided above (the explanation or examples) if it helps clarify your answer.
If the student's question is unclear, politely ask for clarification in Arabic, but try to provide a helpful answer first if possible.
Your response should be complete and ready to display directly to the student. Do not add any extra conversational text like "Here is the answer". Just provide the answer.`,
    }
  );

const lessonTutorFlow = ai.defineFlow(
  {
    name: 'lessonTutorFlow',
    inputSchema: LessonTutorInputSchema,
    outputSchema: LessonTutorOutputSchema,
  },
  async (input) => {
    const { output } = await lessonTutorPrompt(input);
    return output!;
  }
);


export async function getLessonTutorResponse(input: LessonTutorInput): Promise<LessonTutorOutput> {
  return lessonTutorFlow(input);
}
