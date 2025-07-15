
'use server';
/**
 * @fileOverview A simple conversational flow for answering user questions with streaming.
 *
 * - chatStream - A function that handles the chat interaction.
 * - ChatStreamInput - The input type for the chatStream function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatStreamInputSchema = z.object({
  question: z.string().describe('The user\'s question for the AI assistant.'),
});
export type ChatStreamInput = z.infer<typeof ChatStreamInputSchema>;

export async function chatStream(
  input: ChatStreamInput,
  // The onChunk callback is a standard way to handle streams in Next.js/React.
  // It allows the server-side action to send data chunks back to the client.
  onChunk: (chunk: string) => void
) {
  const systemPrompt = 'You are a friendly and helpful English language learning assistant. Answer the user\'s questions clearly and concisely. Keep your answers in Arabic unless the user asks for something in English.';

  const {stream} = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    system: systemPrompt,
    prompt: input.question,
    stream: true,
  });

  // Await the stream and send each chunk back to the client.
  for await (const chunk of stream) {
    onChunk(chunk.text);
  }
}
