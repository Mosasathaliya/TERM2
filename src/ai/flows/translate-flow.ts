'use server';
/**
 * @fileOverview A flow for translating text using Cloudflare Workers AI.
 */
import { z } from 'zod';

const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN;
const MODEL_NAME = '@cf/mistral/mistral-7b-instruct-v0.1';

async function queryCloudflare(messages: { role: string; content: string }[]): Promise<any> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${MODEL_NAME}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Cloudflare AI API error:", errorText);
        throw new Error(`Cloudflare AI API request failed: ${response.statusText}`);
    }
    
    const jsonResponse = await response.json();
    return jsonResponse.result.response;
}

export type TranslateInput = z.infer<typeof TranslateInputSchema>;
const TranslateInputSchema = z.object({
  text: z.string().describe('The text to be translated.'),
  targetLanguage: z.string().describe('The target language for translation (e.g., "Arabic").'),
});

export type TranslateOutput = {
    translation: string;
};

// Export a wrapper function to be called from client-side components.
export async function translateText({ text, targetLanguage }: TranslateInput): Promise<TranslateOutput> {
  
  const messages = [
    { role: 'system', content: `You are an expert translation assistant. Translate the user's text to the specified target language accurately and naturally. Do not add any extra commentary, quotation marks, or phrases like "Here is the translation:". Just provide the direct translation.`},
    { role: 'user', content: `Translate the following text to ${targetLanguage}: "${text}"` }
  ];

  const translation = await queryCloudflare(messages);
  return { translation: translation.trim() };
}
