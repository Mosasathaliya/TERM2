'use server';

/**
 * @fileOverview An AI agent for generating a quiz from a text document.
 */
import { ai } from '@/ai/genkit';
import type { GenerateQuizOutput } from '@/types/quiz';
import { learningItems } from '@/lib/lessons';
import { GenerateQuizOutputSchema } from '@/types/quiz';
import { z } from 'zod';

const GenerateQuizInputSchema = z.object({
  learningMaterial: z.string(),
});

const generateQuizPrompt = ai.definePrompt(
  {
    name: 'generateQuizPrompt',
    input: { schema: GenerateQuizInputSchema },
    output: { schema: GenerateQuizOutputSchema },
    prompt: `Based on the following English learning material, generate a quiz with exactly 20 unique multiple-choice questions. Each question must have 4 options, and you must clearly indicate the correct answer. The questions should cover the various grammar points, vocabulary, and concepts presented in the text. Ensure the questions are varied and test different aspects of the material.

The output must be a single JSON object with a key "questions" which is an array of question objects, matching the output schema.

Here is the material:
---
{{learningMaterial}}
---`,
  }
);


const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: z.void(),
    outputSchema: GenerateQuizOutputSchema,
  },
  async () => {
    const learningMaterial = learningItems.map(item => {
        if (item.type === 'lesson') {
            return `Title: ${item.title}\nExplanation: ${item.explanation}\nStory: ${item.story?.summary || ''}`;
        } else {
            return `Story: ${item.title}\nContent: ${item.content}`;
        }
    }).join('\n\n---\n\n');

    const { output } = await generateQuizPrompt({ learningMaterial });
    return output!;
  }
);

export async function generateQuiz(): Promise<GenerateQuizOutput> {
  return generateQuizFlow();
}
