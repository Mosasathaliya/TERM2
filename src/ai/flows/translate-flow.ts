
'use server';
/**
 * @fileOverview A flow for translating text.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export type TranslateInput = z.infer<typeof TranslateInputSchema>;
const TranslateInputSchema = z.object({
  text: z.string().describe('The text to be translated.'),
  targetLanguage: z.string().describe('The target language for translation (e.g., "Arabic").'),
});

export type TranslateOutput = z.infer<typeof TranslateOutputSchema>;
const TranslateOutputSchema = z.object({
    translation: z.string().describe('The translated text.'),
});

// Export a wrapper function to be called from client-side components.
export const translateText = ai.defineFlow(
  {
    name: 'translateText',
    inputSchema: TranslateInputSchema,
    outputSchema: TranslateOutputSchema,
  },
  async ({ text, targetLanguage }) => {
    const { response } = await ai.generate({
      model: 'gemini-1.5-flash',
      prompt: `Translate the following text to ${targetLanguage}. Do not add any extra commentary or quotation marks, just provide the direct translation.\n\nText: "${text}"`,
    });
    return { translation: response.text };
  }
);
