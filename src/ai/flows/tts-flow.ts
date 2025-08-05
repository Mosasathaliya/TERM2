'use server';

/**
 * @fileOverview A flow for converting text to speech using Cloudflare's MeloTTS model.
 */
import { z } from 'zod';
import { runAi } from '@/lib/cloudflare-ai';

// Define the schema for the flow's input
const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
  language: z.enum(['en', 'ar']).default('en').describe("The speech language ('en' or 'ar')."),
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

  try {
    const response = await runAi({
      model: '@cf/myshell-ai/melotts',
      inputs: {
        prompt: input.text, // Corrected from 'text' to 'prompt'
        lang: input.language,
      },
    });

    // The MeloTTS model returns the raw MP3 audio bytes directly.
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
