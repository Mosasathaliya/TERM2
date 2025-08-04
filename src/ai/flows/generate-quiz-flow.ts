'use server';

/**
 * @fileOverview An AI agent for generating a quiz from a text document.
 */

import type { GenerateQuizOutput } from '@/types/quiz';
import { learningItems } from '@/lib/lessons';
import { GenerateQuizOutputSchema } from '@/types/quiz';

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

    const result = await response.json();
    return result.choices[0]?.message?.content || "";
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
    
    const nvidiaResponse = await queryNVIDIA({
        model: "meta/llama-4-maverick-17b-128e-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2048,
    });

    try {
        const jsonString = nvidiaResponse.match(/\{[\s\S]*\}/)?.[0];
        if (!jsonString) {
            throw new Error("Failed to extract JSON from NVIDIA response.");
        }
        const output = JSON.parse(jsonString);
        return GenerateQuizOutputSchema.parse(output);
    } catch (error) {
        console.error("Failed to parse quiz from NVIDIA response:", error);
        throw new Error("Could not generate a valid quiz.");
    }
}
