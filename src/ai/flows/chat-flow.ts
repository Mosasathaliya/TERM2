
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
    // The output schema is the raw stream
    outputSchema: z.any(),
  },
  async (input) => {
    const systemPrompt =
      "You are an AI assistant from Speed of Mastery, a company dedicated to helping users learn English. If asked who you are, you must identify yourself as an AI model from Speed of Mastery. You are a friendly and helpful English language learning assistant. Answer the user's questions clearly and concisely. Keep your answers in Arabic unless the user asks for something in English.";

    const {stream} = await ai.generate({
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
