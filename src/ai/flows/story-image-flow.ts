
'use server';
/**
 * @fileOverview A Genkit flow for generating an image based on a story's content.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'zod';

const StoryImageInputSchema = z.object({
  story: z.string().describe('The text of the story to illustrate.'),
});
export type StoryImageInput = z.infer<typeof StoryImageInputSchema>;

const StoryImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      "The generated image as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
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
    const prompt = `Generate a simple, colorful, and friendly illustration for the following short story. The style should be suitable for language learners. Focus on the main characters and setting. Story: "${story}"`;
    
    const {media} = await ai.generate({
      model: googleAI.model('imagen-3.0-generate-002'),
      prompt: prompt,
      config: {
        responseMimeType: 'image/jpeg',
        personGeneration: 'ALLOW_ADULT',
        aspectRatio: '9:16',
        numberOfImages: 1,
      },
    });

    if (!media) {
      throw new Error('Image generation failed.');
    }
    
    return { imageUrl: media.url };
  }
);

export async function generateStoryImage(
  input: StoryImageInput
): Promise<StoryImageOutput> {
  return storyImageFlow(input);
}
