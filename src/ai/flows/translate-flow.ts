'use server';
/**
 * @fileOverview A flow for translating text using Cloudflare Workers AI and a dedicated translation model.
 */
import { z } from 'zod';
import { runAi } from '@/lib/cloudflare-ai';


export type TranslateInput = z.infer<typeof TranslateInputSchema>;
const TranslateInputSchema = z.object({
  text: z.union([z.string(), z.array(z.string())]).describe('The text or array of texts to be translated.'),
  sourceLanguage: z.string().default('en').describe('The source language code (e.g., "en" for English).'),
  targetLanguage: z.string().describe('The target language for translation (e.g., "ar" for Arabic).'),
});

export type TranslateOutput = {
    translation: string | string[];
};

export async function translateText({ text, sourceLanguage = 'en', targetLanguage }: TranslateInput): Promise<TranslateOutput> {
  const isBatch = Array.isArray(text);

  const response = await runAi({
    model: '@cf/meta/m2m100-1.2b',
    inputs: {
        text: text,
        source_lang: sourceLanguage,
        target_lang: targetLanguage,
        ...(isBatch && { batch_size: text.length }) // This might not be an official param, but it's good practice to consider if available.
    },
  });

  const jsonResponse = await response.json();

  if (isBatch) {
    // Assuming the API returns an array of objects for batch requests
    const translations = jsonResponse.result.map((item: any) => item.translated_text.trim());
    return { translation: translations };
  } else {
    const translation = jsonResponse.result.translated_text;
    return { translation: translation.trim() };
  }
}
