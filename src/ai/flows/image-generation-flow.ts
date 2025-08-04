'use server';
/**
 * @fileOverview A centralized flow for generating an image using a specified model.
 */
import { z } from 'zod';

const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN;
const MODEL_NAME = '@cf/black-forest-labs/flux-1-schnell';

const ImageInputSchema = z.object({
  prompt: z.string().describe('The text description of the image to generate.'),
});
export type ImageInput = z.infer<typeof ImageInputSchema>;

const ImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      "The generated image as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type ImageOutput = z.infer<typeof ImageOutputSchema>;

export async function generateImage(input: ImageInput): Promise<ImageOutput> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${MODEL_NAME}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: input.prompt,
      }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Cloudflare Image API error:", errorText);
        throw new Error(`Cloudflare Image API request failed: ${response.statusText}`);
    }

    // The FLUX model returns the raw image bytes directly
    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    
    return {
      imageUrl: `data:image/png;base64,${base64Image}`
    };

  } catch (error) {
    console.error("Error in image generation flow:", error);
    // Return a placeholder on error to prevent app crash
    return {
        imageUrl: `https://placehold.co/512x512/FF0000/FFFFFF.png?text=Error`
    };
  }
}
