'use server';
/**
 * @fileOverview A flow for translating text using Cloudflare Workers AI and a dedicated translation model.
 */
import { z } from 'zod';
import { runAi } from '@/lib/cloudflare-ai';


export type TranslateInput = z.infer<typeof TranslateInputSchema>;
const TranslateInputSchema = z.object({
  text: z.string().describe('The text to be translated.'),
  sourceLanguage: z.string().default('en').describe('The source language code (e.g., "en" for English).'),
  targetLanguage: z.string().describe('The target language for translation (e.g., "ar" for Arabic).'),
});

export type TranslateOutput = {
    translation: string;
};

// Export a wrapper function to be called from client-side components.
export async function translateText({ text, sourceLanguage = 'en', targetLanguage }: TranslateInput): Promise<TranslateOutput> {
  const response = await runAi({
    model: '@cf/meta/m2m100-1.2b',
    inputs: { text, source_lang: sourceLanguage, target_lang: targetLanguage },
  });
  
  const jsonResponse = await response.json();
  const translation = jsonResponse.result.translated_text;
  return { translation: translation.trim() };
}
