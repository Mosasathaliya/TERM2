
'use server';

/**
 * @fileOverview A Genkit flow for converting text to speech.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import wav from 'wav';

// Helper function to convert PCM buffer to Base64 WAV
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

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

// Define the schema for the flow's output
const TextToSpeechOutputSchema = z.object({
  media: z.string().describe("The generated audio as a Base64 encoded WAV data URI."),
});

// Define the Genkit flow
const ttsFlow = ai.defineFlow(
  {
    name: 'ttsFlow',
    inputSchema: z.string(),
    outputSchema: TextToSpeechOutputSchema,
  },
  async (query) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' }, // A pleasant, clear voice
          },
        },
      },
      prompt: query,
    });

    if (!media) {
      throw new Error('No media was returned from the text-to-speech model.');
    }
    
    // The returned data is raw PCM, so we need to convert it to a WAV file format
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavBase64 = await toWav(audioBuffer);

    return {
      media: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);


// Exported wrapper function to be called from the client
export async function textToSpeech(text: string): Promise<{ media: string } | null> {
  try {
    const result = await ttsFlow(text);
    return result;
  } catch (error) {
    console.error("Error in textToSpeech flow:", error);
    return null;
  }
}
