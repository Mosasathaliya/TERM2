
'use server';

/**
 * @fileOverview A flow for converting text to speech with a specified voice.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import wav from 'wav';

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

// Asynchronously convert PCM audio data to WAV format.
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

    let bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));

    writer.write(pcmData);
    writer.end();
  });
}

// Exported wrapper function to be called from the client
export async function textToSpeech(input: TextToSpeechInput): Promise<{ media: string } | null> {
  try {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: input.voice || 'Algenib' },
          },
        },
      },
      prompt: input.text,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavBase64 = await toWav(audioBuffer);
    return { media: 'data:audio/wav;base64,' + wavBase64 };
  } catch (error) {
    console.error("Error in textToSpeech flow:", error);
    return null;
  }
}
