'use server';
/**
 * @fileOverview A flow for translating text using Cloudflare Workers AI and a dedicated translation model.
 * This has been updated to use a direct fetch call to ensure the correct request format.
 */
import { z } from 'zod';

const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN;

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
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
    throw new Error("Cloudflare AI credentials are not set in the environment variables.");
  }
  
  const isBatch = Array.isArray(text);
  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/m2m100-1.2b`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      source_lang: sourceLanguage,
      target_lang: targetLanguage,
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Cloudflare AI API error for translation model:`, errorText);
    throw new Error(`Cloudflare AI API request failed: ${response.statusText}`);
  }

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
