
'use server';
/**
 * @fileOverview A flow for generating an image based on a story's content using the Hugging Face Inference API.
 */

import { z } from 'zod';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
// Using the recommended fast and efficient SDXL-Turbo model
const IMAGE_MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo";


const StoryImageInputSchema = z.object({
  story: z.string().describe('The text of the story to illustrate.'),
});
export type StoryImageInput = z.infer<typeof StoryImageInputSchema>;

const StoryImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      "The generated image as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type StoryImageOutput = z.infer<typeof StoryImageOutputSchema>;


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

    const result = await response.blob();
    return result;
}

// Helper to convert Blob to base64 data URI
async function blobToDataURI(blob: Blob): Promise<string> {
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    return `data:${blob.type};base64,${base64}`;
}


// This is the main function that will be called from the client.
// It's no longer a Genkit flow but a standard server action.
export async function generateStoryImage(
  input: StoryImageInput
): Promise<StoryImageOutput> {
  const prompt = `A simple, colorful, and friendly illustration for the story: "${input.story}"`;
  
  try {
    const imageBlob = await queryHuggingFaceImage(prompt);
    const imageUrl = await blobToDataURI(imageBlob);
    return { imageUrl };
  } catch (error) {
    console.error("Image generation failed:", error);
    // In case of an error, we can return a placeholder or re-throw
    throw new Error("Image generation failed.");
  }
}
