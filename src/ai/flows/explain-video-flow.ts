
'use server';
/**
 * @fileOverview A flow to generate explanations for a YouTube video topic.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export type ExplainVideoInput = z.infer<typeof ExplainVideoInputSchema>;
const ExplainVideoInputSchema = z.object({
  videoTitle: z.string().describe('The title of the YouTube video to be explained.'),
});

export type ExplainVideoOutput = z.infer<typeof ExplainVideoOutputSchema>;
const ExplainVideoOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the video topic in simple Arabic.'),
  keyConcepts: z.string().describe('A list of key concepts from the video, explained simply in Arabic.'),
  analogy: z.string().describe('An analogy or simple comparison to help understand the topic, in Arabic.'),
});

export const explainVideoTopic = ai.defineFlow(
  {
    name: 'explainVideoTopic',
    inputSchema: ExplainVideoInputSchema,
    outputSchema: ExplainVideoOutputSchema,
  },
  async ({ videoTitle }) => {
    const { output } = await ai.generate({
      model: 'gemini-1.5-flash',
      output: { schema: ExplainVideoOutputSchema },
      prompt: `You are an expert science communicator for an Arabic-speaking audience. The user is watching a YouTube video from the 'What If' series titled: "${videoTitle}".

Your task is to provide three distinct types of explanations for the main topic of this video, all in simple, clear Arabic.

1.  **Summary (summary)**: Provide a concise, one-paragraph summary of the video's main idea.
2.  **Key Concepts (keyConcepts)**: List and briefly explain 2-3 key scientific or theoretical concepts discussed in the video.
3.  **Analogy (analogy)**: Create a simple analogy or comparison to a more familiar concept to help a beginner understand the core idea.

Ensure all three explanations are in simple Arabic and are easy to understand.`,
    });
    return output!;
  }
);
