'use server';
/**
 * @fileOverview A simple conversational flow.
 */

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

async function queryNVIDIA(data: any) {
    const API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
    const response = await fetch(API_URL, {
        headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_NVIDIA_API_KEY}`,
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error("NVIDIA API error:", errorText);
        throw new Error(`NVIDIA API request failed: ${response.statusText}`);
    }

    return response;
}

// A streamable flow that takes a history and a system prompt and returns a stream of the AI's response.
export async function chatStream(prompt: string): Promise<ReadableStream<Uint8Array>> {
    const nvidiaResponse = await queryNVIDIA({
        model: "meta/llama-4-maverick-17b-128e-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 512,
        temperature: 1.0,
        top_p: 1.0,
        stream: true
    });

    if (!nvidiaResponse.body) {
        throw new Error("The response body is null.");
    }
    
    // The NVIDIA API with stream=true returns a standard ReadableStream
    return nvidiaResponse.body;
}
