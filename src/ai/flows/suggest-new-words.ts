'use server';

/**
 * @fileOverview An AI agent for suggesting new vocabulary words based on a given category.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SuggestNewWordsInputSchema = z.object({
  category: z
    .string()
    .describe('The category of words to suggest (e.g., Emotional, Professional, Intellectual).'),
  numberOfWords: z.number().default(5).describe('The number of words to generate'),
});
export type SuggestNewWordsInput = z.infer<typeof SuggestNewWordsInputSchema>;

const SuggestNewWordsOutputSchema = z.array(
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

const suggestWordsPrompt = ai.definePrompt(
  {
    name: 'suggestWordsPrompt',
    input: { schema: SuggestNewWordsInputSchema },
    output: { schema: SuggestNewWordsOutputSchema },
    prompt: `You are a vocabulary expert. Suggest {{numberOfWords}} new English words related to the category '{{category}}'. Provide the output as a single JSON array of objects. Each object must have the keys specified in the output schema.`,
  }
);

const suggestNewWordsFlow = ai.defineFlow(
  {
    name: 'suggestNewWordsFlow',
    inputSchema: SuggestNewWordsInputSchema,
    outputSchema: SuggestNewWordsOutputSchema,
  },
  async ({ category, numberOfWords }) => {
    const { output } = await suggestWordsPrompt({ category, numberOfWords });
    return output!;
  }
);

export async function suggestNewWords(input: SuggestNewWordsInput): Promise<SuggestNewWordsOutput> {
  return suggestNewWordsFlow(input);
}
