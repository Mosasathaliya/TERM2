
'use server';

/**
 * @fileOverview An AI agent for generating a quiz from a text document, using Hugging Face.
 */

import { GenerateQuizOutputSchema } from '@/types/quiz';
import type { GenerateQuizOutput } from '@/types/quiz';
import { learningItems } from '@/lib/lessons';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";


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


export async function generateQuiz(): Promise<GenerateQuizOutput> {
    if (!HUGGING_FACE_API_KEY) {
        throw new Error("Hugging Face API key is not configured.");
    }

    // Consolidate all learning material into a single string.
    const learningMaterial = learningItems.map(item => {
        if (item.type === 'lesson') {
            return `Title: ${item.title}\nExplanation: ${item.explanation}\nStory: ${item.story?.summary || ''}`;
        } else {
            return `Story: ${item.title}\nContent: ${item.content}`;
        }
    }).join('\n\n---\n\n');

    const prompt = `Based on the following English learning material, generate a quiz with exactly 20 unique multiple-choice questions. Each question must have 4 options, and you must clearly indicate the correct answer. The questions should cover the various grammar points, vocabulary, and concepts presented in the text. Ensure the questions are varied and test different aspects of the material.

Here is the material:
---
${learningMaterial}
---

You MUST respond with only a valid JSON object containing a 'questions' array with exactly 20 question objects. The format must be:
{
  "questions": [
    {
      "question": "A question about the material.",
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
            max_new_tokens: 4096, // Increased token limit for a large quiz
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
        const validatedQuiz = GenerateQuizOutputSchema.parse(parsedJson);
        
        if (!validatedQuiz.questions || validatedQuiz.questions.length !== 20) {
            throw new Error('AI failed to generate the required number of quiz questions.');
        }

        return validatedQuiz;

    } catch (error) {
        console.error("Generate quiz error:", error);
        throw new Error("Failed to generate quiz.");
    }
}
