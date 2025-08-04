'use server';
/**
 * @fileOverview A flow for generating a branded certificate background image.
 * This is currently a placeholder as the app is configured with a text-only model.
 */
import { z } from 'zod';

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

/**
 * This flow is designed to generate a certificate background image.
 * NOTE: The current AI configuration uses a text-only model.
 * This function will return a placeholder image. To enable real image
 * generation, you would need to integrate an image generation API here.
 */
export async function generateCertificateImage(
  input: CertificateImageInput
): Promise<CertificateImageOutput> {
    console.warn("Image generation called, but a text-only model is configured. Returning a placeholder.");
    
    // Create a placeholder URL using an external service
    const placeholderText = 'Certificate for ' + input.userName;
    const imageUrl = `https://placehold.co/800x600/1C3D5A/FFFFFF.png?text=${encodeURIComponent(placeholderText)}`;
    
    return { imageUrl };
}
