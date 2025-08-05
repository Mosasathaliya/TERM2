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
    },
  });

  const jsonResponse = await response.json();

  if (jsonResponse.result && jsonResponse.result.translated_text) {
    if (isBatch) {
      // For batch requests, Cloudflare might return an array of objects, each with a translated_text key.
      // Or it might return an object with a translated_text key that is an array of strings.
      // This handles both possibilities.
      const translations = Array.isArray(jsonResponse.result.translated_text)
        ? jsonResponse.result.translated_text
        : jsonResponse.result.map((item: any) => item.translated_text.trim());
      return { translation: translations };
    } else {
      const translation = jsonResponse.result.translated_text;
      return { translation: translation.trim() };
    }
  }

  // Fallback for unexpected response structure
  console.error("Unexpected translation API response structure:", jsonResponse);
  throw new Error("Failed to parse translation from AI response.");
}
