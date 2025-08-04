'use server';

/**
 * @fileOverview An AI agent for generating a quiz from a story's content.
 */

import { z } from 'zod';

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


async function queryHuggingFace(data: any) {
    const API_URL = "https://api-inference.huggingface.co/models/gpt2";
    const response = await fetch(API_URL, {
        headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}`,
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

    const result = await response.json();
    return result[0]?.generated_text || "";
}


export async function generateStoryQuiz({ storyContent }: StoryQuizInput): Promise<StoryQuizOutput> {
    const prompt = `Based on the following short story, generate a quiz with exactly 5 multiple-choice questions to test comprehension. Each question must have 4 options, and you must clearly indicate the correct answer. The questions should be about the plot, characters, or key details of the story.

Your output must be a single JSON object with a "questions" key, which holds an array of 5 question objects.

Story:
---
${storyContent}
---

Here is the JSON object:
`;
    
    const hfResponse = await queryHuggingFace({
      inputs: prompt,
      parameters: { max_new_tokens: 500, return_full_text: false }
    });

    try {
        const jsonString = hfResponse.match(/\{[\s\S]*\}/)?.[0];
        if (!jsonString) {
            throw new Error("Failed to extract JSON from Hugging Face response.");
        }
        const output = JSON.parse(jsonString);
        return StoryQuizOutputSchema.parse(output);
    } catch (error) {
        console.error("Failed to parse story quiz from Hugging Face response:", error);
        throw new Error("Could not generate a valid story quiz.");
    }
}
