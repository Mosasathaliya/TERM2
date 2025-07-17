
'use server';
/**
 * @fileOverview A Genkit flow for generating a certificate background image.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const CertificateImageInputSchema = z.object({
  userName: z.string().describe('The name of the user receiving the certificate.'),
});
export type CertificateImageInput = z.infer<typeof CertificateImageInputSchema>;

const CertificateImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      "The generated image as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type CertificateImageOutput = z.infer<typeof CertificateImageOutputSchema>;

const certificateImageFlow = ai.defineFlow(
  {
    name: 'certificateImageFlow',
    inputSchema: CertificateImageInputSchema,
    outputSchema: CertificateImageOutputSchema,
  },
  async ({userName}) => {
    const prompt = `A professional, elegant, and modern certificate background. The design should be abstract with a sophisticated color palette of blue, gold, and white. Include subtle geometric patterns, elegant lines, and a clean, minimalist feel suitable for an official "Certificate of Completion" from a language learning app. Do not include any text.`;
    
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media) {
      throw new Error('Image generation failed. No media was returned.');
    }
    
    return { imageUrl: media.url };
  }
);

export async function generateCertificateImage(
  input: CertificateImageInput
): Promise<CertificateImageOutput> {
  return certificateImageFlow(input);
}
