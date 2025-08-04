'use server';
/**
 * @fileOverview A simple conversational flow using Cloudflare Workers AI.
 */
import { z } from 'zod';

const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN;
const MODEL_NAME = '@cf/meta/llama-3-8b-instruct';

async function queryCloudflare(messages: { role: string; content: string }[]): Promise<any> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${MODEL_NAME}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Cloudflare AI API error:", errorText);
        throw new Error(`Cloudflare AI API request failed: ${response.statusText}`);
    }
    
    const jsonResponse = await response.json();
    return jsonResponse.result.response;
}


// A streamable flow that takes a history and a system prompt and returns a stream of the AI's response.
export async function chatStream(prompt: string): Promise<ReadableStream<Uint8Array>> {
  const responseText = await queryCloudflare([{ role: "user", content: prompt }]);
  
  // Create a simple ReadableStream from the single response string
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(responseText));
      controller.close();
    }
  });

  return stream;
}
