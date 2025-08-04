'use server';

/**
 * @fileOverview An AI agent for suggesting new vocabulary words based on a given category.
 */

import { z } from 'zod';

const SuggestNewWordsInputSchema = z.object({
  category: z
    .string()
    .describe('The category of words to suggest (e.g., Emotional, Professional, Intellectual).'),
  numberOfWords: z.number().default(5).describe('The number of words to generate'),
});
export type SuggestNewWordsInput = z.infer<typeof SuggestNewWordsInputSchema>;

const SuggestNewWordsOutputSchema = z.array(
  z.object({
    english: z.string().describe('The English word.'),
    arabic: z.string().describe('The Arabic translation of the word.'),
    definition: z.string().describe('The English definition of the word.'),
    arabicDefinition: z.string().describe('The Arabic definition of the word.'),
    example: z.string().describe('An example sentence using the word in English.'),
    arabicExample: z.string().describe('An example sentence using the word in Arabic.'),
  })
);
export type SuggestNewWordsOutput = z.infer<typeof SuggestNewWordsOutputSchema>;

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


export async function suggestNewWords({ category, numberOfWords }: SuggestNewWordsInput): Promise<SuggestNewWordsOutput> {
    const prompt = `You are a vocabulary expert. Suggest ${numberOfWords} new English words related to the category '${category}'. Provide the output as a single JSON array of objects. Each object must have the following keys: "english", "arabic", "definition", "arabicDefinition", "example", "arabicExample".

Here is the JSON array:
`;
    
    const nvidiaResponse = await queryNVIDIA({
        model: "meta/llama-4-maverick-17b-128e-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
    });

    try {
        const jsonString = nvidiaResponse.match(/\[[\s\S]*\]/)?.[0];
        if (!jsonString) {
            throw new Error("Failed to extract JSON from NVIDIA response.");
        }
        const output = JSON.parse(jsonString);
        return SuggestNewWordsOutputSchema.parse(output);
    } catch (error) {
        console.error("Failed to parse new words from NVIDIA response:", error);
        throw new Error("Could not generate valid new words.");
    }
}
