
'use server';
/**
 * @fileOverview A flow for generating an image based on a story's content.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

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

// This flow is designed to generate an image based on a story's content.
export async function generateStoryImage(
  input: StoryImageInput
): Promise<StoryImageOutput> {
  const { media } = await ai.generate({
    model: 'googleai/gemini-2.0-flash-preview-image-generation',
    prompt: `A simple, colorful, and friendly illustration for the story: "${input.story}"`,
    config: {
      responseModalities: ['IMAGE', 'TEXT'],
    },
  });
  const imageUrl = media.url;
  return { imageUrl };
}
