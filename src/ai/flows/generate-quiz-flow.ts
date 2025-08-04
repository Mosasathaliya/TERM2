'use server';

/**
 * @fileOverview An AI agent for generating a quiz from a text document.
 */

import type { GenerateQuizOutput } from '@/types/quiz';
import { learningItems } from '@/lib/lessons';
import { GenerateQuizOutputSchema } from '@/types/quiz';

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


export async function generateQuiz(): Promise<GenerateQuizOutput> {
    const learningMaterial = learningItems.map(item => {
        if (item.type === 'lesson') {
            return `Title: ${item.title}\nExplanation: ${item.explanation}\nStory: ${item.story?.summary || ''}`;
        } else {
            return `Story: ${item.title}\nContent: ${item.content}`;
        }
    }).join('\n\n---\n\n');

    const prompt = `Based on the following English learning material, generate a quiz with exactly 20 unique multiple-choice questions. Each question must have 4 options, and you must clearly indicate the correct answer. The questions should cover the various grammar points, vocabulary, and concepts presented in the text. Ensure the questions are varied and test different aspects of the material.

The output must be a single JSON object with a key "questions" which is an array of question objects. Each question object must have "question", "options", and "correct_answer" keys.

Here is the material:
---
${learningMaterial}
---

Here is the JSON object:
`;
    
    const hfResponse = await queryHuggingFace({
      inputs: prompt,
      parameters: { max_new_tokens: 2048, return_full_text: false }
    });

    try {
        const jsonString = hfResponse.match(/\{[\s\S]*\}/)?.[0];
        if (!jsonString) {
            throw new Error("Failed to extract JSON from Hugging Face response.");
        }
        const output = JSON.parse(jsonString);
        return GenerateQuizOutputSchema.parse(output);
    } catch (error) {
        console.error("Failed to parse quiz from Hugging Face response:", error);
        throw new Error("Could not generate a valid quiz.");
    }
}
