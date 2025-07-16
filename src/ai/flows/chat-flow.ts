
'use server';
/**
 * @fileOverview A simple server action for streaming conversational AI responses.
 */

import {ai} from '@/ai/genkit';

/**
 * A streamable server action that takes a user's question and returns a stream of the AI's response.
 * @param question The user's question as a string.
 * @returns A ReadableStream of the AI's response text.
 */
export async function chatStream(question: string): Promise<ReadableStream<Uint8Array>> {
    const systemPrompt =
      "You are an AI assistant from Speed of Mastery, a company dedicated to helping users learn English. If asked who you are, you must identify yourself as an AI model from Speed of Mastery. You are a friendly and helpful English language learning assistant. Answer the user's questions clearly and concisely. Keep your answers in Arabic unless the user asks for something in English.";

    const { stream: genkitStream } = ai.generateStream({
      model: 'googleai/gemini-2.5-flash',
      system: systemPrompt,
      prompt: question,
    });
    
    // Create a new ReadableStream to send to the client.
    // We will manually process the Genkit stream and push data into this new stream.
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
        async start(controller) {
            // Process the Genkit stream
            for await (const chunk of genkitStream) {
                const text = chunk.text;
                if (text) {
                    controller.enqueue(encoder.encode(text));
                }
            }
            // Close the stream when we're done.
            controller.close();
        },
        cancel() {
            console.log("Stream cancelled by client.");
        }
    });

    return readableStream;
}
