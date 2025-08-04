
'use server';
/**
 * @fileOverview A simple conversational flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SystemPromptSchema = z.string().optional();

// Define the schema for the flow's input
const ChatInputSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
    })
  ),
  systemPrompt: SystemPromptSchema,
});

// A streamable flow that takes a history and a system prompt and returns a stream of the AI's response.
export const chatStream = ai.defineFlow(
  {
    name: 'chatStream',
    inputSchema: ChatInputSchema,
    outputSchema: z.string(),
    stream: true,
  },
  async ({ history, systemPrompt }, streamingCallback) => {
    // Construct a system prompt if provided.
    const system = systemPrompt
      ? {
          content: systemPrompt,
          role: 'system' as const,
        }
      : undefined;

    const { stream, response } = await ai.generate({
      model: 'gemini-1.5-flash',
      history: system ? [system, ...history] : history,
      stream: streamingCallback,
    });

    // Wait for the response to be fully processed, then extract the final text.
    const result = await response;
    return result.text;
  }
);
