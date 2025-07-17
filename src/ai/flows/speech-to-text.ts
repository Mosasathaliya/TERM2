'use server';

/**
 * @fileOverview Defines a Genkit flow for converting spoken audio into text.
 * This flow takes an audio data URI and returns the transcribed text.
 *
 * - speechToText - A function that handles the speech-to-text conversion.
 * - SpeechToTextInput - The input type for the speechToText function.
 * - SpeechToTextOutput - The return type for the speechToText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

// Input schema for the speech-to-text flow
const SpeechToTextInputSchema = z.object({
  audio: z
    .string()
    .describe(
      "The audio data to be transcribed, provided as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SpeechToTextInput = z.infer<typeof SpeechToTextInputSchema>;

// Output schema for the speech-to-text flow
const SpeechToTextOutputSchema = z.object({
  text: z.string().describe('The transcribed text from the audio.'),
});
export type SpeechToTextOutput = z.infer<typeof SpeechToTextOutputSchema>;

// Define the main Genkit flow for speech-to-text
const speechToTextFlow = ai.defineFlow(
  {
    name: 'speechToTextFlow',
    inputSchema: SpeechToTextInputSchema,
    outputSchema: SpeechToTextOutputSchema,
  },
  async ({ audio }) => {
    // Generate content using the Gemini model with a prompt that includes media.
    const { text } = await ai.generate({
      prompt: [
        // Provide the audio media directly in the prompt.
        { media: { url: audio } },
        // Add a text part to instruct the model on what to do.
        { text: 'Transcribe the provided audio.' },
      ],
    });

    if (!text) {
        // Handle cases where transcription might fail or return an empty string.
        return { text: "" };
    }

    return { text };
  }
);

/**
 * An exported async function that wraps the Genkit flow.
 * This is the function that will be called from the application's frontend to transcribe audio.
 * @param input - The audio data URI.
 * @returns A promise that resolves to the transcribed text.
 */
export async function speechToText(input: SpeechToTextInput): Promise<SpeechToTextOutput> {
  return speechToTextFlow(input);
}
