
'use server';
/**
 * @fileOverview A Genkit flow for generating an image based on a story's content using Imagen 3.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

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

const storyImageFlow = ai.defineFlow(
  {
    name: 'storyImageFlow',
    inputSchema: StoryImageInputSchema,
    outputSchema: StoryImageOutputSchema,
  },
  async ({story}) => {
    const prompt = `A simple, colorful, and friendly illustration for a story about: "${story}"`;
    
    // This configuration now matches the working Python example provided by the user.
    const {media} = await ai.generate({
      model: 'googleai/imagen-3.0-generate-002',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '9:16',
        outputMimeType: 'image/jpeg',
        personGeneration: 'ALLOW_ADULT',
      },
    });

    if (!media) {
      throw new Error('Image generation failed. No media was returned.');
    }
    
    // The image data is already in the correct data URI format.
    return { imageUrl: media.url };
  }
);

export async function generateStoryImage(
  input: StoryImageInput
): Promise<StoryImageOutput> {
  return storyImageFlow(input);
}
