
'use server';
/**
 * @fileOverview A Genkit flow to generate explanations for a YouTube video topic.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ExplainVideoInputSchema = z.object({
  videoTitle: z.string().describe('The title of the YouTube video to be explained.'),
});
export type ExplainVideoInput = z.infer<typeof ExplainVideoInputSchema>;

const ExplainVideoOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the video topic in simple Arabic.'),
  keyConcepts: z.string().describe('A list of key concepts from the video, explained simply in Arabic.'),
  analogy: z.string().describe('An analogy or simple comparison to help understand the topic, in Arabic.'),
});
export type ExplainVideoOutput = z.infer<typeof ExplainVideoOutputSchema>;

const explainVideoFlow = ai.defineFlow(
  {
    name: 'explainVideoFlow',
    inputSchema: ExplainVideoInputSchema,
    outputSchema: ExplainVideoOutputSchema,
  },
  async ({ videoTitle }) => {
    const prompt = `You are an expert science communicator for an Arabic-speaking audience. The user is watching a YouTube video from the 'What If' series titled: "${videoTitle}".

Your task is to provide three distinct types of explanations for the main topic of this video, all in simple, clear Arabic.

1.  **Summary (summary)**: Provide a concise, one-paragraph summary of the video's main idea.
2.  **Key Concepts (keyConcepts)**: List and briefly explain 2-3 key scientific or theoretical concepts discussed in the video.
3.  **Analogy (analogy)**: Create a simple analogy or comparison to a more familiar concept to help a beginner understand the core idea.

Ensure all three explanations are in simple Arabic and are easy to understand. Respond only with the JSON object.`;

    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: prompt,
      output: {
        format: 'json',
        schema: ExplainVideoOutputSchema,
      },
    });

    if (!output) {
      throw new Error('AI failed to generate video explanation.');
    }
    return output;
  }
);

export async function explainVideoTopic(
  input: ExplainVideoInput
): Promise<ExplainVideoOutput> {
  return explainVideoFlow(input);
}
