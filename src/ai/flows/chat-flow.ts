'use server';
/**
 * @fileOverview A simple conversational flow.
 */
import { ai } from '@/ai/genkit';
import { streamToAsyncIterable } from '@/lib/utils';
import { z } from 'zod';

// Define the schema for the flow's input
const ChatInputSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
    })
  ),
  systemPrompt: z.string().optional(),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;


// A streamable flow that takes a history and a system prompt and returns a stream of the AI's response.
export async function chatStream(prompt: string): Promise<ReadableStream<Uint8Array>> {
  const { stream } = await ai.generate({
    model: 'gemini-1.5-flash',
    prompt: prompt,
    stream: true,
  });
  return stream;
}
