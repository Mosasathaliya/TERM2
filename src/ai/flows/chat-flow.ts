'use server';
/**
 * @fileOverview A conversational flow using Cloudflare Workers AI, enhanced with a reranker model.
 */
import { z } from 'zod';
import { findMostRelevantLesson } from './reranker-flow';
import { learningItems } from '@/lib/lessons';
import { runAi } from '@/lib/cloudflare-ai';

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
      const response = await runAi({ model: '@cf/meta/llama-3-8b-instruct', inputs: { messages }, stream: true });
      return response.body!;
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
