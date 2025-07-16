
'use server';
/**
 * @fileOverview A simple conversational flow for answering user questions with streaming.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {generate} from 'genkit';

const ChatStreamInputSchema = z.object({
  question: z.string(),
});

// Note: We are defining a proper Genkit flow now.
export const chatStreamFlow = ai.defineFlow(
  {
    name: 'chatStreamFlow',
    inputSchema: ChatStreamInputSchema,
    outputSchema: z.string(),
    stream: true, // Enable streaming for this flow
  },
  async (input) => {
    const systemPrompt =
      "You are an AI assistant from Speed of Mastery, a company dedicated to helping users learn English. You are a friendly and helpful English language learning assistant. Answer the user's questions clearly and concisely. Keep your answers in Arabic unless the user asks for something in English.";

    const stream = await generate({
      model: 'googleai/gemini-2.5-flash',
      system: systemPrompt,
      prompt: input.question,
      stream: true,
    });

    // The 'stream' object from generate() is now a proper ReadableStream
    // that Genkit can handle and pass to the client.
    return stream;
  }
);
