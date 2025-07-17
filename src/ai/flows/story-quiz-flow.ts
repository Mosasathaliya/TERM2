
'use server';

/**
 * @fileOverview An AI agent for generating a quiz from a story's content.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const StoryQuizInputSchema = z.object({
  storyContent: z.string().describe('The content of the story to generate a quiz from.'),
});

export type StoryQuizInput = z.infer<typeof StoryQuizInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question about the story.'),
  options: z.array(z.string()).length(4).describe('An array of 4 possible answers.'),
  correct_answer: z.string().describe('The correct answer from the options.'),
});

const StoryQuizOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).length(3).describe('An array of exactly 3 quiz questions based on the story.'),
});

export type StoryQuizOutput = z.infer<typeof StoryQuizOutputSchema>;

const storyQuizFlow = ai.defineFlow(
  {
    name: 'storyQuizFlow',
    inputSchema: StoryQuizInputSchema,
    outputSchema: StoryQuizOutputSchema,
  },
  async ({ storyContent }) => {
    const prompt = `Based on the following short story, generate a quiz with exactly 3 multiple-choice questions to test comprehension. Each question must have 4 options, and you must clearly indicate the correct answer. The questions should be about the plot, characters, or key details of the story.

Story:
---
${storyContent}
---

Your response MUST be a JSON object containing a 'questions' array with exactly 3 question objects.
`;

    const {output} = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: prompt,
      output: {
        format: 'json',
        schema: StoryQuizOutputSchema,
      },
    });

    if (!output || !output.questions || output.questions.length !== 3) {
      throw new Error('AI failed to generate the required number of quiz questions for the story.');
    }

    return output;
  }
);

export async function generateStoryQuiz(input: StoryQuizInput): Promise<StoryQuizOutput> {
  return storyQuizFlow(input);
}
