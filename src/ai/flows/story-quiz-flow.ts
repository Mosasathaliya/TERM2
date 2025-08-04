
'use server';

/**
 * @fileOverview An AI agent for generating a quiz from a story's content, using Hugging Face.
 */

import { z } from 'zod';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";

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

async function queryHuggingFace(payload: object) {
    const response = await fetch(MODEL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Hugging Face API error:", errorText);
        throw new Error(`Hugging Face API request failed: ${response.statusText}`);
    }
    return response.json();
}

export async function generateStoryQuiz(input: StoryQuizInput): Promise<StoryQuizOutput> {
    if (!HUGGING_FACE_API_KEY) {
        throw new Error("Hugging Face API key is not configured.");
    }
    
    const { storyContent } = input;
    
    const prompt = `Based on the following short story, generate a quiz with exactly 5 multiple-choice questions to test comprehension. Each question must have 4 options, and you must clearly indicate the correct answer. The questions should be about the plot, characters, or key details of the story.

Story:
---
${storyContent}
---

You MUST respond with only a valid JSON object containing a 'questions' array with exactly 5 question objects. The format must be:
{
  "questions": [
    {
      "question": "A question about the story.",
      "options": ["word1", "word2", "correct_answer_word", "word4"],
      "correct_answer": "correct_answer_word"
    },
    ...
  ]
}
`;

    const huggingFacePayload = {
        inputs: `<|system|>\nYou are an API that returns JSON.<|end|>\n<|user|>\n${prompt}<|end|>\n<|assistant|>`,
        parameters: {
            max_new_tokens: 1024,
            return_full_text: false,
        },
    };

    try {
        const result = await queryHuggingFace(huggingFacePayload);
        const responseText = result[0]?.generated_text;

        if (!responseText) {
            throw new Error("AI did not return any text.");
        }

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("AI response did not contain a valid JSON object.");
        }

        const parsedJson = JSON.parse(jsonMatch[0]);
        const validatedOutput = StoryQuizOutputSchema.parse(parsedJson);

        if (!validatedOutput.questions || validatedOutput.questions.length !== 5) {
            throw new Error('AI failed to generate the required number of quiz questions for the story.');
        }
        
        return validatedOutput;
    } catch (error) {
        console.error("Generate story quiz error:", error);
        throw new Error("Failed to generate story quiz.");
    }
}
