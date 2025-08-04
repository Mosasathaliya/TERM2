
'use server';

/**
 * @fileOverview An AI agent for generating a quiz from a story's content.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export type StoryQuizInput = z.infer<typeof StoryQuizInputSchema>;
const StoryQuizInputSchema = z.object({
  storyContent: z.string().describe('The content of the story to generate a quiz from.'),
});

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question about the story.'),
  options: z.array(z.string()).length(4).describe('An array of 4 possible answers.'),
  correct_answer: z.string().describe('The correct answer from the options.'),
});

export type StoryQuizOutput = z.infer<typeof StoryQuizOutputSchema>;
const StoryQuizOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).length(5).describe('An array of exactly 5 quiz questions based on the story.'),
});

export const generateStoryQuiz = ai.defineFlow(
  {
    name: 'generateStoryQuiz',
    inputSchema: StoryQuizInputSchema,
    outputSchema: StoryQuizOutputSchema,
  },
  async ({ storyContent }) => {
    const { output } = await ai.generate({
      model: 'gemini-1.5-flash',
      output: { schema: StoryQuizOutputSchema },
      prompt: `Based on the following short story, generate a quiz with exactly 5 multiple-choice questions to test comprehension. Each question must have 4 options, and you must clearly indicate the correct answer. The questions should be about the plot, characters, or key details of the story.

Story:
---
${storyContent}
---
`,
    });
    return output!;
  }
);
