
'use server';

/**
 * @fileOverview A flow for converting text to speech using Cloudflare's MeloTTS model.
 * This version is updated to handle both binary and JSON responses from the API
 * and correctly selects the voice based on the requested language.
 */
import { z } from 'zod';
import { runAi } from '@/lib/cloudflare-ai';

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

// Define the schema for the flow's input.
const TextToSpeechInputSchema = z.object({
  prompt: z.string().describe('The text to convert to speech.'),
  lang: z.enum(['en', 'ar']).default('en').describe("The speech language ('en' or 'ar')."),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

export type TextToSpeechOutput = {
  media: string;
};

// Exported wrapper function to be called from the client
export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput | null> {
  const { prompt, lang } = input;

  if (!prompt.trim()) {
    console.warn('TTS Flow: Received empty prompt. Aborting.');
    return null;
  }

  const voice = lang === 'ar' ? 'ar-AE-Fatima-Neural' : 'en-US-Jenny-Neural';

  try {
    const response = await runAi({
      model: '@cf/myshell-ai/melotts',
      inputs: {
        prompt: prompt,
        voice: voice,
      },
    });

    let base64Audio: string;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const jsonResponse = await response.json();
      if (jsonResponse.result && jsonResponse.result.audio) {
        base64Audio = jsonResponse.result.audio;
      } else {
        console.error('TTS Flow: JSON response did not contain audio data.', jsonResponse);
        return null;
      }
    } else if (contentType && contentType.includes('audio/mpeg')) {
      const audioBuffer = await response.arrayBuffer();
      if (audioBuffer.byteLength < 100) {
        const errorText = new TextDecoder().decode(audioBuffer);
        console.error(`TTS Flow: Received an empty or very small audio buffer from the API. Potential error: ${errorText}`);
        return null;
      }
      base64Audio = arrayBufferToBase64(audioBuffer);
    } else {
      console.error(`TTS Flow: Received unexpected content type: ${contentType}`);
      return null;
    }

    return {
      media: `data:audio/mpeg;base64,${base64Audio}`,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`Error in textToSpeech flow: ${errorMessage}`);
    return null;
  }
}
