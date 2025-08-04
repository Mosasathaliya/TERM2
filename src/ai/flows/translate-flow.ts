'use server';
/**
 * @fileOverview A flow for translating text using Cloudflare Workers AI and a dedicated translation model.
 */
import { z } from 'zod';

const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN;
const MODEL_NAME = '@cf/meta/m2m100-1.2b';

async function queryCloudflare(text: string, source_lang: string, target_lang: string): Promise<any> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${MODEL_NAME}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, source_lang, target_lang }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Cloudflare Translation API error:", errorText);
        throw new Error(`Cloudflare Translation API request failed: ${response.statusText}`);
    }
    
    const jsonResponse = await response.json();
    return jsonResponse.result.translated_text;
}

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
  const translation = await queryCloudflare(text, sourceLanguage, targetLanguage);
  return { translation: translation.trim() };
}
