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

const explainVideoPrompt = ai.definePrompt(
  {
    name: 'explainVideoPrompt',
    input: { schema: ExplainVideoInputSchema },
    output: { schema: ExplainVideoOutputSchema },
    prompt: `You are an expert science communicator for an Arabic-speaking audience. The user is watching a YouTube video from the 'What If' series titled: "{{videoTitle}}".

Your task is to provide three distinct types of explanations for the main topic of this video, all in simple, clear Arabic.

The output must be a single, valid JSON object with three keys as described in the output schema.
1. "summary": A concise, one-paragraph summary of the video's main idea.
2. "keyConcepts": A list and brief explanation of 2-3 key scientific or theoretical concepts discussed in the video.
3. "analogy": A simple analogy or comparison to a more familiar concept to help a beginner understand the core idea.

The entire response must be only the JSON object, with no other text before or after it.`,
  }
);


const explainVideoFlow = ai.defineFlow(
  {
    name: 'explainVideoFlow',
    inputSchema: ExplainVideoInputSchema,
    outputSchema: ExplainVideoOutputSchema,
  },
  async ({ videoTitle }) => {
    const { output } = await explainVideoPrompt({ videoTitle });
    return output!;
  }
);

export async function explainVideoTopic(input: ExplainVideoInput): Promise<ExplainVideoOutput> {
    return explainVideoFlow(input);
}
