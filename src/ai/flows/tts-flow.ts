
'use server';

/**
 * @fileOverview A flow for converting text to speech with a specified voice.
 */

import { z } from 'zod';

// Define the schema for the flow's input
const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
  voice: z.string().optional().describe('The voice to use.'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

// Define the schema for the flow's output
const TextToSpeechOutputSchema = z.object({
  media: z.string().describe("The generated audio as a Base64 encoded WAV data URI."),
});


// Exported wrapper function to be called from the client
export async function textToSpeech(input: TextToSpeechInput): Promise<{ media: string } | null> {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/mms-tts-ara",
      {
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}` },
        method: "POST",
        body: JSON.stringify({ inputs: input.text }),
      }
    );
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Hugging Face TTS API error:", errorText);
        throw new Error(`Hugging Face TTS API request failed: ${response.statusText}`);
    }

	  const audioBlob = await response.blob();
    const reader = new FileReader();
    const dataUrlPromise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
    });
    reader.readAsDataURL(audioBlob);
    const audioDataUrl = await dataUrlPromise;
    
    return { media: audioDataUrl };
  } catch (error) {
    console.error("Error in textToSpeech flow:", error);
    return null;
  }
}
