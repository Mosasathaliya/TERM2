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


export async function suggestNewWords({ category, numberOfWords }: SuggestNewWordsInput): Promise<SuggestNewWordsOutput> {
    const prompt = `You are a vocabulary expert. Suggest ${numberOfWords} new English words related to the category '${category}'. Provide the output as a single JSON array of objects. Each object must have the following keys: "english", "arabic", "definition", "arabicDefinition", "example", "arabicExample".

Here is the JSON array:
`;
    
    const hfResponse = await queryHuggingFace({
      inputs: prompt,
      parameters: { max_new_tokens: 500, return_full_text: false }
    });

    try {
        const jsonString = hfResponse.match(/\[[\s\S]*\]/)?.[0];
        if (!jsonString) {
            throw new Error("Failed to extract JSON from Hugging Face response.");
        }
        const output = JSON.parse(jsonString);
        return SuggestNewWordsOutputSchema.parse(output);
    } catch (error) {
        console.error("Failed to parse new words from Hugging Face response:", error);
        throw new Error("Could not generate valid new words.");
    }
}
