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

const storyQuizPrompt = ai.definePrompt(
  {
    name: 'storyQuizPrompt',
    input: { schema: StoryQuizInputSchema },
    output: { schema: StoryQuizOutputSchema },
    prompt: `Based on the following short story, generate a quiz with exactly 5 multiple-choice questions to test comprehension. Each question must have 4 options, and you must clearly indicate the correct answer. The questions should be about the plot, characters, or key details of the story.

Your output must be a single JSON object with a "questions" key, which holds an array of 5 question objects.

Story:
---
{{storyContent}}
---`,
  }
);


const generateStoryQuizFlow = ai.defineFlow(
  {
    name: 'generateStoryQuizFlow',
    inputSchema: StoryQuizInputSchema,
    outputSchema: StoryQuizOutputSchema,
  },
  async ({ storyContent }) => {
    const { output } = await storyQuizPrompt({ storyContent });
    return output!;
  }
);

export async function generateStoryQuiz({ storyContent }: StoryQuizInput): Promise<StoryQuizOutput> {
  return generateStoryQuizFlow({ storyContent });
}
