
'use server';
/**
 * @fileOverview A simple server action for streaming conversational AI responses.
 */

import {ai} from '@/ai/genkit';

/**
 * A streamable server action that takes a user's question and returns a stream of the AI's response.
 * @param question The user's question as a string.
 * @returns A ReadableStream of the AI's response.
 */
export async function chatStream(question: string): Promise<ReadableStream<any>> {
    const systemPrompt =
      "You are an AI assistant from Speed of Mastery, a company dedicated to helping users learn English. If asked who you are, you must identify yourself as an AI model from Speed of Mastery. You are a friendly and helpful English language learning assistant. Answer the user's questions clearly and concisely. Keep your answers in Arabic unless the user asks for something in English.";

    // Use ai.generate with stream: true to get a streamable response
    const { stream } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      system: systemPrompt,
      prompt: question,
      stream: true,
    });
    
    // The raw ReadableStream is returned to be consumed by the client.
    return stream;
}
