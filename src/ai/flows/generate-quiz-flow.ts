
'use server';

/**
 * @fileOverview An AI agent for generating a quiz from a text document.
 */

import { ai } from '@/ai/genkit';
import { GenerateQuizOutputSchema } from '@/types/quiz';
import type { GenerateQuizOutput } from '@/types/quiz';
import { learningItems } from '@/lib/lessons';


export const generateQuiz = ai.defineFlow(
  {
    name: 'generateQuiz',
    outputSchema: GenerateQuizOutputSchema,
  },
  async () => {
    // Consolidate all learning material into a single string.
    const learningMaterial = learningItems.map(item => {
        if (item.type === 'lesson') {
            return `Title: ${item.title}\nExplanation: ${item.explanation}\nStory: ${item.story?.summary || ''}`;
        } else {
            return `Story: ${item.title}\nContent: ${item.content}`;
        }
    }).join('\n\n---\n\n');

    const { output } = await ai.generate({
      model: 'gemini-1.5-flash',
      output: { schema: GenerateQuizOutputSchema },
      prompt: `Based on the following English learning material, generate a quiz with exactly 20 unique multiple-choice questions. Each question must have 4 options, and you must clearly indicate the correct answer. The questions should cover the various grammar points, vocabulary, and concepts presented in the text. Ensure the questions are varied and test different aspects of the material.

Here is the material:
---
${learningMaterial}
---
`,
    });
    return output!;
  }
);
