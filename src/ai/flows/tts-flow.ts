
'use server';

/**
 * @fileOverview A flow for converting text to speech using Cloudflare's MeloTTS model.
 */
import { z } from 'zod';

const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN;
const MODEL_NAME = '@cf/myshell-ai/melotts';

// Define the schema for the flow's input
const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
  language: z.enum(['en', 'ar']).default('en').describe("The language of the speech ('en' or 'ar')."),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

export type TextToSpeechOutput = {
  media: string;
};

// Exported wrapper function to be called from the client
export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput | null> {
  const { text, language } = input;
  
  if (!text.trim()) {
    return null;
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${MODEL_NAME}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: text,
        lang: language,
      }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Cloudflare TTS API error:", errorText);
        throw new Error(`Cloudflare TTS API request failed: ${response.statusText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    
    return {
      media: `data:audio/mpeg;base64,${base64Audio}`
    };

  } catch (error) {
    console.error("Error in textToSpeech flow:", error);
    return null;
  }
}
