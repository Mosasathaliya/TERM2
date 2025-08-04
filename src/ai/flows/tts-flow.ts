
'use server';

/**
 * @fileOverview A flow for converting text to speech with a specified voice, using the Hugging Face Inference API.
 */

import { z } from 'zod';
import wav from 'wav';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
// Using a model that supports Arabic for TTS
const TTS_MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/facebook/mms-tts-ara";

// Define the schema for the flow's input. The 'voice' parameter is not used with this model, but kept for signature consistency.
const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
  voice: z.string().optional().describe('The voice to use (not applicable for this model).'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

// Define the schema for the flow's output
const TextToSpeechOutputSchema = z.object({
  media: z.string().describe("The generated audio as a Base64 encoded WAV data URI."),
});


async function queryHuggingFaceTTS(text: string): Promise<Blob> {
    const response = await fetch(
        TTS_MODEL_ENDPOINT,
        {
            headers: { Authorization: `Bearer ${HUGGING_FACE_API_KEY}` },
            method: "POST",
            body: JSON.stringify({ inputs: text }),
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Hugging Face TTS API error:", errorText);
        throw new Error(`Hugging Face TTS API request failed: ${response.statusText}`);
    }

    // The API returns the audio data directly as a blob
    const result = await response.blob();
    return result;
}

// Helper to convert Blob to base64 data URI
async function blobToDataURI(blob: Blob): Promise<string> {
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    // The MMS model returns audio/flac, but let's assume we can treat it as generic audio
    return `data:${blob.type};base64,${base64}`;
}


// Exported wrapper function to be called from the client
export async function textToSpeech(input: TextToSpeechInput): Promise<{ media: string } | null> {
  if (!HUGGING_FACE_API_KEY) {
    throw new Error("Hugging Face API key is not configured.");
  }
  try {
    const audioBlob = await queryHuggingFaceTTS(input.text);
    const dataUri = await blobToDataURI(audioBlob);
    return { media: dataUri };
  } catch (error) {
    console.error("Error in textToSpeech flow:", error);
    return null;
  }
}
