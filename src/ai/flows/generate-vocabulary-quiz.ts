'use server';

/**
 * @fileOverview An AI agent for generating a vocabulary quiz based on a list of words.
 *
 * - generateVocabularyQuiz - A function that creates a quiz.
 * - VocabularyQuizInput - The input type for the generateVocabularyQuiz function.
 * - VocabularyQuizOutput - The output type for the generateVocabularyQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const WordSchema = z.object({
  english: z.string(),
  arabic: z.string(),
  definition: z.string(),
  arabicDefinition: z.string(),
  example: z.string(),
  arabicExample: z.string(),
});

const VocabularyQuizInputSchema = z.object({
  words: z.array(WordSchema).describe('The list of words the user has just studied.'),
});
export type VocabularyQuizInput = z.infer<typeof VocabularyQuizInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question, asking for a definition or a synonym.'),
  options: z.array(z.string()).length(4).describe('An array of 4 possible answers.'),
  correct_answer: z.string().describe('The correct English word from the options.'),
});

const VocabularyQuizOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).length(5).describe('An array of exactly 5 quiz questions.'),
});
export type VocabularyQuizOutput = z.infer<typeof VocabularyQuizOutputSchema>;


export async function generateVocabularyQuiz(input: VocabularyQuizInput): Promise<VocabularyQuizOutput> {
  return vocabularyQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVocabularyQuizPrompt',
  input: {schema: VocabularyQuizInputSchema},
  output: {schema: VocabularyQuizOutputSchema},
  prompt: `You are a quiz master. Based on the following list of vocabulary words, create a quiz with exactly 5 multiple-choice questions.

Each question should test the user's knowledge of one of the words. The question should be a definition or a synonym phrase.
The options should be four English words, one of which is the correct answer. The correct answer must be one of the words from the provided list. The other three options should be plausible but incorrect distractors.

Word List:
{{#each words}}
- {{this.english}}: {{this.definition}}
{{/each}}

Generate the 5 questions and return them in the specified JSON format.
`,
});

const vocabularyQuizFlow = ai.defineFlow(
  {
    name: 'vocabularyQuizFlow',
    inputSchema: VocabularyQuizInputSchema,
    outputSchema: VocabularyQuizOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate vocabulary quiz.');
    }
    return output;
  }
);
