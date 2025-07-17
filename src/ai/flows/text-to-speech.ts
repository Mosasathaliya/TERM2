'use server';

/**
 * @fileOverview Defines a Genkit flow for converting text into speech using a specified voice.
 * This flow takes a text string and a voice name, and returns an audio data URI.
 *
 * - textToSpeech - A function that handles the text-to-speech conversion.
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'zod';
import wav from 'wav';

// Define the list of available prebuilt voices from Google AI.
const PREBUILT_VOICES = [
  'Alloy', 'Echo', 'Fable', 'Onyx', 'Nova', 'Shimmer', // OpenAI voices
  'en-US-Standard-A', 'en-US-Standard-B', 'en-US-Standard-C', 'en-US-Standard-D', // Google voices
  'Algenib', 'Antares', 'Sirius', // Additional Google voices
] as const;

// Input schema for the text-to-speech flow
const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
  voice: z.enum(PREBUILT_VOICES).describe('The prebuilt voice to use for the speech.'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

// Output schema for the text-to-speech flow
const TextToSpeechOutputSchema = z.object({
  audio: z
    .string()
    .describe(
      "The generated audio as a Base64 encoded WAV data URI. Format: 'data:audio/wav;base64,<encoded_data>'"
    ),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

/**
 * A helper function to convert raw PCM audio data into a WAV format Base64 string.
 * The text-to-speech model returns raw audio, which needs to be encoded into a playable format.
 */
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (chunk) => bufs.push(chunk));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));

    writer.write(pcmData);
    writer.end();
  });
}

// Define the main Genkit flow for text-to-speech
const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async ({ text, voice }) => {
    // Generate audio using the specified TTS model
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      prompt: text,
      config: {
        // Specify that the response modality is audio
        responseModalities: ['AUDIO'],
        // Configure the speech synthesis options
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    if (!media) {
      throw new Error('No media was returned from the text-to-speech model.');
    }

    // The model returns raw PCM audio as a data URI. We need to decode it and re-encode as WAV.
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    // Convert the PCM buffer to a WAV Base64 string
    const wavBase64 = await toWav(audioBuffer);

    return {
      audio: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);

/**
 * An exported async function that wraps the Genkit flow.
 * This is the function that will be called from the application's frontend.
 * @param input - The text and voice configuration.
 * @returns A promise that resolves to the audio data URI.
 */
export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}
