
'use server';
/**
 * @fileOverview A simple server action for streaming conversational AI responses.
 */

import {ai} from '@/ai/genkit';
import { generate } from 'genkit';

/**
 * A streamable server action that takes a user's question and returns a stream of the AI's response.
 * @param question The user's question as a string.
 * @returns A ReadableStream of the AI's response text.
 */
export async function chatStream(question: string): Promise<ReadableStream<Uint8Array>> {
    const systemPrompt =
      "You are an AI assistant from Speed of Mastery, a company dedicated to helping users learn English. If asked who you are, you must identify yourself as an AI model from Speed of Mastery. You are a friendly and helpful English language learning assistant. Answer the user's questions clearly and concisely. Keep your answers in Arabic unless the user asks for something in English.";

    // The `generateStream` method returns a `stream` and a `response` promise.
    const { stream } = ai.generateStream({
      model: 'googleai/gemini-2.5-flash',
      system: systemPrompt,
      prompt: question,
    });
    
    // We need to transform the stream of complex Genkit objects into a stream of plain text.
    const encoder = new TextEncoder();
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        // From the complex chunk object, we only need the text content.
        const text = chunk.text;
        if (text) {
          controller.enqueue(encoder.encode(text));
        }
      },
    });

    // The raw ReadableStream from Genkit is piped through our transformer.
    // The resulting stream, which contains only plain text, is returned to the client.
    return stream.pipeThrough(transformStream);
}
