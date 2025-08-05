'use server';
/**
 * @fileOverview A conversational flow using Cloudflare Workers AI, enhanced with a reranker model.
 */
import { z } from 'zod';
import { findMostRelevantLesson } from './reranker-flow';
import { learningItems } from '@/lib/lessons';

const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN;
const MODEL_NAME = '@cf/meta/llama-3-8b-instruct';

async function queryCloudflare(messages: { role: string; content: string }[], stream: boolean): Promise<any> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${MODEL_NAME}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages, stream }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Cloudflare AI API error:", errorText);
        throw new Error(`Cloudflare AI API request failed: ${response.statusText}`);
    }
    
    // If streaming, return the response body directly
    if (stream) {
        return response.body;
    }
    
    const jsonResponse = await response.json();
    return jsonResponse.result.response;
}


// A streamable flow that takes a history and a system prompt and returns a stream of the AI's response.
export async function chatStream(prompt: string): Promise<ReadableStream<Uint8Array>> {
  
  // 1. Find the most relevant lesson using the reranker
  const relevantLessonIndex = await findMostRelevantLesson(prompt, learningItems.map(item => item.title + ': ' + (item.type === 'lesson' ? item.explanation : item.content)));

  let systemPrompt = "You are a helpful and friendly English learning assistant from Speed of Mastery. Answer the user's question clearly and concisely. If relevant, use the provided lesson context to inform your answer. Your main language must be English, but you can use Arabic for clarification if needed.";
  
  if (relevantLessonIndex !== null) {
      const relevantLesson = learningItems[relevantLessonIndex];
      const lessonContent = relevantLesson.type === 'lesson' ? relevantLesson.explanation : relevantLesson.content;
      systemPrompt += `\n\n---RELEVANT LESSON CONTEXT---\nTitle: ${relevantLesson.title}\nContent: ${lessonContent}\n-----------------------------`;
  }
  
  // 2. Query the LLM with the enhanced prompt to get a streamed response
  const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
  ];

  try {
      const stream = await queryCloudflare(messages, true);
      // The response from Cloudflare for streams is not directly a ReadableStream<Uint8Array>
      // but something that can be iterated. We'll wrap it to be compatible.
      // A simple pass-through is often sufficient if the client-side handles chunk decoding.
      return stream;
  } catch (error) {
      console.error("Error getting chat stream:", error);
      const errorStream = new ReadableStream({
          start(controller) {
              const errorMessage = "Sorry, I encountered an error. Please try again.";
              controller.enqueue(new TextEncoder().encode(errorMessage));
              controller.close();
          }
      });
      return errorStream;
  }
}
