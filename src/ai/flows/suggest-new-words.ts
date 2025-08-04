
'use server';

/**
 * @fileOverview An AI agent for suggesting new vocabulary words based on a given category.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const SuggestNewWordsInputSchema = z.object({
  category: z
    .string()
    .describe('The category of words to suggest (e.g., Emotional, Professional, Intellectual).'),
  numberOfWords: z.number().default(5).describe('The number of words to generate'),
});
export type SuggestNewWordsInput = z.infer<typeof SuggestNewWordsInputSchema>;

export const SuggestNewWordsOutputSchema = z.array(
  z.object({
    english: z.string().describe('The English word.'),
    arabic: z.string().describe('The Arabic translation of the word.'),
    definition: z.string().describe('The English definition of the word.'),
    arabicDefinition: z.string().describe('The Arabic definition of the word.'),
    example: z.string().describe('An example sentence using the word in English.'),
    arabicExample: z.string().describe('An example sentence using the word in Arabic.'),
  })
);
export type SuggestNewWordsOutput = z.infer<typeof SuggestNewWordsOutputSchema>;

export const suggestNewWords = ai.defineFlow(
  {
    name: 'suggestNewWords',
    inputSchema: SuggestNewWordsInputSchema,
    outputSchema: SuggestNewWordsOutputSchema,
  },
  async ({ category, numberOfWords }) => {
    const { output } = await ai.generate({
      model: 'gemini-1.5-flash',
      output: { schema: SuggestNewWordsOutputSchema },
      prompt: `You are a vocabulary expert. Suggest ${numberOfWords} new English words related to the category '${category}'. Provide the following for each word:
- The English word.
- The Arabic translation.
- The English definition.
- The Arabic definition.
- An example sentence using the word in English.
- An example sentence using the word in Arabic.`,
    });
    return output!;
  }
);
