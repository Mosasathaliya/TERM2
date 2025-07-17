'use server';

/**
 * @fileOverview An AI agent for generating a quiz from a text document.
 *
 * - generateQuiz - A function that creates a quiz.
 */

import {ai} from '@/ai/genkit';
import * as fs from 'fs/promises';
import * as path from 'path';
import { GenerateQuizOutputSchema, type GenerateQuizOutput } from '@/types/quiz';

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    outputSchema: GenerateQuizOutputSchema,
  },
  async () => {
    // Read the explanation.txt file
    const filePath = path.join(process.cwd(), 'explanation.txt');
    const fileContent = await fs.readFile(filePath, 'utf-8');

    const prompt = `Based on the following English learning material, generate a quiz with exactly 50 unique multiple-choice questions. Each question must have 4 options, and you must clearly indicate the correct answer. The questions should cover the various grammar points, vocabulary, and concepts presented in the text. Ensure the questions are varied and test different aspects of the material.

Here is the material:
---
${fileContent}
---

Your response MUST be a JSON object containing a 'questions' array with exactly 50 question objects.
`;

    const {output} = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: prompt,
      output: {
        format: 'json',
        schema: GenerateQuizOutputSchema,
      },
    });

    if (!output || !output.questions || output.questions.length !== 50) {
      throw new Error('AI failed to generate the required number of quiz questions.');
    }

    return output;
  }
);

export async function generateQuiz(): Promise<GenerateQuizOutput> {
  return generateQuizFlow();
}
