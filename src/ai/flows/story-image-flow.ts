
'use server';
/**
 * @fileOverview A Genkit flow for generating an image based on a story's content.
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
    // A simple, direct prompt for the image generation model.
    const prompt = `A simple, colorful, and friendly illustration for the story: "${story}"`;
    
    // Generate the image using the correct model and required configuration for streaming modalities.
    const {media} = await ai.generate({
      // This is the correct model for image generation in Genkit.
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: prompt,
      config: {
        // Both TEXT and IMAGE modalities are required for this model to work correctly.
        responseModalities: ['TEXT', 'IMAGE'],
        // Specify aspect ratio for consistent image sizes.
        aspectRatio: '9:16',
        numberOfImages: 1,
      },
    });

    if (!media) {
      throw new Error('Image generation failed. No media was returned.');
    }
    
    // The image data is returned as a data URI and can be used directly.
    return { imageUrl: media.url };
  }
);

// Export a wrapper function to be called from client-side components.
export async function generateStoryImage(
  input: StoryImageInput
): Promise<StoryImageOutput> {
  return storyImageFlow(input);
}
