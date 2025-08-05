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
    translation: any;
};

export async function translateText({ text, sourceLanguage = 'en', targetLanguage }: TranslateInput): Promise<TranslateOutput> {
  const isBatch = Array.isArray(text);

  const response = await runAi({
    model: '@cf/meta/m2m100-1.2b',
    inputs: {
      text: text,
      source_lang: sourceLanguage, // Correct parameter name
      target_lang: targetLanguage, // Correct parameter name
    },
  });
  
  const jsonResponse = await response.json();
  
  if (jsonResponse.result && jsonResponse.result.translated_text) {
    if (isBatch) {
      const translations = Array.isArray(jsonResponse.result.translated_text)
        ? jsonResponse.result.translated_text
        : [jsonResponse.result.translated_text];
      return { translation: translations.map(t => t.trim()) };
    } else {
      const translation = jsonResponse.result.translated_text;
      return { translation: translation.trim() };
    }
  }

  console.error("Unexpected translation API response structure:", jsonResponse);
  throw new Error("Failed to parse translation from AI response.");
}
