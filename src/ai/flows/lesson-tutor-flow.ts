
'use server';
/**
 * @fileOverview Provides AI-powered tutoring assistance for specific lesson content.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { LessonExample } from '@/types/lesson';

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


export const getLessonTutorResponse = ai.defineFlow(
  {
    name: 'getLessonTutorResponse',
    inputSchema: LessonTutorInputSchema,
    outputSchema: LessonTutorOutputSchema,
  },
  async (input) => {
    let prompt = `You are a specialist AI English language tutor for Arabic-speaking students. 
Your entire response MUST be in Arabic.
Your personality is encouraging and patient.

The student is studying a lesson titled "${input.lessonTitle}" on the topic of "${input.lessonTopic}" at the "${input.lessonLevel}" level.

Here is the core lesson material you must use to answer the question:
---
Lesson Explanation (in Arabic): "${input.lessonArabicExplanation}"
---
Lesson Examples:
${input.lessonExamples.map(ex => `- English: "${ex.english}", Arabic: "${ex.arabic}"`).join('\n')}
---
${input.lessonAdditionalNotesArabic ? `Additional Notes (in Arabic): "${input.lessonAdditionalNotesArabic}"\n---` : ''}
${input.lessonCommonMistakesArabic ? `Common Mistakes (in Arabic): "${input.lessonCommonMistakesArabic}"\n---` : ''}

The student's question is: "${input.studentQuestion}"

Your task is to provide a clear, helpful, and concise answer to the student's question **in Arabic only**.
Refer to the lesson material provided above (the explanation or examples) if it helps clarify your answer.
If the student's question is unclear, politely ask for clarification in Arabic, but try to provide a helpful answer first if possible.
Your response should be complete and ready to display directly to the student. Do not add any extra conversational text like "Here is the answer". Just provide the answer.`;
    
    const { response } = await ai.generate({
      model: 'gemini-1.5-flash',
      prompt,
    });
    
    return { aiTutorResponse: response.text };
  }
);
