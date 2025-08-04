'use server';

/**
 * @fileOverview An AI agent for generating a quiz from a story's content using Cloudflare Workers AI.
 */
import { z } from 'zod';

const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN;
const MODEL_NAME = '@cf/meta/llama-3-8b-instruct';

async function queryCloudflare(prompt: string): Promise<any> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${MODEL_NAME}`;
    
    const messages = [
        {
            role: "system",
            content: `You are an expert quiz creator. Your task is to generate a JSON object representing a quiz based on the provided story. The JSON object must have a key "questions" which is an array of exactly 5 multiple-choice question objects. Each question object must have keys "question", "options" (an array of 4 strings), and "correct_answer". Do not output any text other than the JSON object.`
        },
        {
            role: "user",
            content: prompt,
        }
    ];
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages, raw: true }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Cloudflare AI API error:", errorText);
        throw new Error(`Cloudflare AI API request failed: ${response.statusText}`);
    }
    
    const jsonResponse = await response.json();
    return JSON.parse(jsonResponse.result.response);
}

export type StoryQuizInput = z.infer<typeof StoryQuizInputSchema>;
const StoryQuizInputSchema = z.object({
  storyContent: z.string().describe('The content of the story to generate a quiz from.'),
});

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question about the story.'),
  options: z.array(z.string()).length(4).describe('An array of 4 possible answers.'),
  correct_answer: z.string().describe('The correct answer from the options.'),
});

export type StoryQuizOutput = z.infer<typeof StoryQuizOutputSchema>;
const StoryQuizOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).length(5).describe('An array of exactly 5 quiz questions based on the story.'),
});

export async function generateStoryQuiz({ storyContent }: StoryQuizInput): Promise<StoryQuizOutput> {
  const prompt = `Based on the following short story, generate a quiz with exactly 5 multiple-choice questions to test comprehension. Each question must have 4 options, and you must clearly indicate the correct answer. The questions should be about the plot, characters, or key details of the story.

Your output must be a single JSON object with a "questions" key, which holds an array of 5 question objects.

Story:
---
${storyContent}
---`;

  const output = await queryCloudflare(prompt);
  return output;
}
