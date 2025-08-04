
'use server';
/**
 * @fileOverview A flow for generating a branded certificate background image using the Hugging Face Inference API.
 */

import { z } from 'zod';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const IMAGE_MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo";

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

async function queryHuggingFaceImage(prompt: string): Promise<Blob> {
    if (!HUGGING_FACE_API_KEY) {
        throw new Error("Hugging Face API key not configured.");
    }
    const response = await fetch(
        IMAGE_MODEL_ENDPOINT,
        {
            headers: { Authorization: `Bearer ${HUGGING_FACE_API_KEY}` },
            method: "POST",
            body: JSON.stringify({ inputs: prompt }),
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Hugging Face Image API error:", errorText);
        throw new Error(`Hugging Face API request failed: ${response.statusText}`);
    }

    return await response.blob();
}

async function blobToDataURI(blob: Blob): Promise<string> {
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    return `data:${blob.type};base64,${base64}`;
}

export async function generateCertificateImage(
  input: CertificateImageInput
): Promise<CertificateImageOutput> {
  const prompt = `A professional and prestigious certificate background for 'Speed of Mastery'. Use a color palette of deep navy blue and light sky blue. The design must be clean, elegant, and modern. Include a subtle, elegant watermark of a geometric brain icon in the center. On the bottom right, include a circular seal element that looks like a modern, official stamp. The seal should be light blue and contain abstract, clean lines, but no text.`;
    
  try {
    const imageBlob = await queryHuggingFaceImage(prompt);
    const imageUrl = await blobToDataURI(imageBlob);
    return { imageUrl };
  } catch (error) {
    console.error("Certificate image generation failed:", error);
    throw new Error("Image generation failed.");
  }
}
