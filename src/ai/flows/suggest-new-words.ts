
'use server';

/**
 * @fileOverview An AI agent for suggesting new vocabulary words based on a given category, using Hugging Face.
 */

import { z } from 'zod';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct";

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

export async function suggestNewWords(input: SuggestNewWordsInput): Promise<SuggestNewWordsOutput> {
    if (!HUGGING_FACE_API_KEY) {
        throw new Error("Hugging Face API key is not configured.");
    }

    const { category, numberOfWords } = input;

    const prompt = `You are a vocabulary expert. Suggest ${numberOfWords} new English words related to the category '${category}'. Provide the following for each word:
- The English word.
- The Arabic translation.
- The English definition.
- The Arabic definition.
- An example sentence using the word in English.
- An example sentence using the word in Arabic.

You MUST respond with only a valid JSON array of objects, with no other text before or after the array. The format must be:
[
  {
    "english": "English word",
    "arabic": "Arabic translation",
    "definition": "English definition of the word",
    "arabicDefinition": "Arabic definition of the word",
    "example": "Example sentence using the word in English",
    "arabicExample": "Example sentence using the word in Arabic"
  },
  ...
]
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
        
        // Clean the response to ensure it's valid JSON
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error("AI response did not contain a valid JSON array.");
        }
        
        const parsedJson = JSON.parse(jsonMatch[0]);
        return SuggestNewWordsOutputSchema.parse(parsedJson);

    } catch (error) {
        console.error("Suggest new words error:", error);
        throw new Error("Failed to generate new words.");
    }
}
