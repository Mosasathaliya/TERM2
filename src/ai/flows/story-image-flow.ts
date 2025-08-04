'use server';
/**
 * @fileOverview A flow for generating an image based on a story's content.
 * This flow is currently a placeholder as the configured AI model is text-only.
 */
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

/**
 * This flow is designed to generate an image based on a story's content.
 * NOTE: The current AI configuration uses a text-only model.
 * This function will return a placeholder image. To enable real image
 * generation, you would need to integrate an image generation API here.
 */
export async function generateStoryImage(
  input: StoryImageInput
): Promise<StoryImageOutput> {
  console.warn("Image generation called, but a text-only model is configured. Returning a placeholder.");
  
  // Create a placeholder URL using an external service
  const placeholderText = encodeURIComponent(input.story.substring(0, 50) + '...');
  const imageUrl = `https://placehold.co/600x400/1E1E1E/FFFFFF.png?text=${placeholderText}`;
  
  return { imageUrl };
}
