'use server';
/**
 * @fileOverview A simple conversational flow.
 */

import { z } from 'zod';
import { streamToAsyncIterable } from '@/lib/utils';

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

async function queryHuggingFace(data: any) {
    const API_URL = "https://api-inference.huggingface.co/models/gpt2";
    const response = await fetch(API_URL, {
        headers: {
            "Authorization": `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Hugging Face API error:", errorText);
        throw new Error(`Hugging Face API request failed: ${response.statusText}`);
    }

    return response;
}

// A streamable flow that takes a history and a system prompt and returns a stream of the AI's response.
export async function chatStream(prompt: string): Promise<ReadableStream<Uint8Array>> {
    const hfResponse = await queryHuggingFace({
        inputs: prompt,
        parameters: { max_new_tokens: 250, return_full_text: false }
    });

    if (!hfResponse.body) {
        throw new Error("The response body is null.");
    }
    
    // For non-streaming models, we need to adapt the response.
    // The gpt2 endpoint does not stream. We'll return the full response as a single chunk.
    const result = await hfResponse.json();
    const text = result[0]?.generated_text || "";

    const stream = new ReadableStream({
        start(controller) {
            controller.enqueue(new TextEncoder().encode(text));
            controller.close();
        }
    });

    return stream;
}
