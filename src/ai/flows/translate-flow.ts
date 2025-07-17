
'use server';
/**
 * @fileOverview A Genkit flow for translating text.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const TranslateInputSchema = z.object({
  text: z.string().describe('The text to be translated.'),
  targetLanguage: z.string().describe('The target language for translation (e.g., "Arabic").'),
});
export type TranslateInput = z.infer<typeof TranslateInputSchema>;

const TranslateOutputSchema = z.object({
    translation: z.string().describe('The translated text.'),
});
export type TranslateOutput = z.infer<typeof TranslateOutputSchema>;


const translateFlow = ai.defineFlow(
  {
    name: 'translateFlow',
    inputSchema: TranslateInputSchema,
    outputSchema: TranslateOutputSchema,
  },
  async ({ text, targetLanguage }) => {
    const prompt = `Translate the following text to ${targetLanguage}. Do not add any extra commentary, just provide the direct translation.\n\nText: "${text}"`;

    const response = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: prompt,
    });
    
    const translation = response.text;
    if (!translation) {
      throw new Error('Translation failed to generate text.');
    }
    
    return { translation };
  }
);

// Export a wrapper function to be called from client-side components.
export async function translateText(
  input: TranslateInput
): Promise<TranslateOutput> {
  return translateFlow(input);
}
