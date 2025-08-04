
'use server';
/**
 * @fileOverview A flow for generating an image based on a story's content.
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

// This flow is designed to generate an image based on a story's content.
export async function generateStoryImage(
  input: StoryImageInput
): Promise<StoryImageOutput> {
  const response = await fetch(
		"https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo",
		{
			headers: { "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}` },
			method: "POST",
			body: JSON.stringify({
        inputs: `A simple, colorful, and friendly illustration for the story: "${input.story}"`
      }),
		}
	);
	const imageBlob = await response.blob();
  const reader = new FileReader();
  const dataUrlPromise = new Promise<string>((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
  });
  reader.readAsDataURL(imageBlob);
  const imageUrl = await dataUrlPromise;

  return { imageUrl };
}
