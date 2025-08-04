
'use server';

/**
 * @fileOverview An AI agent for suggesting new vocabulary words and getting their details
 * using Cloudflare Workers AI.
 * This file is updated to make more robust, separate calls for generation and translation.
 */
import { z } from 'zod';
import { translateText } from './translate-flow';

const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN;
const GENERATIVE_MODEL_NAME = '@cf/meta/llama-3-8b-instruct';


// Suggests a list of words
const SuggestNewWordsInputSchema = z.object({
  category: z
    .string()
    .describe('The category of words to suggest (e.g., Emotional, Professional, Intellectual).'),
  numberOfWords: z.number().default(5).describe('The number of words to generate'),
});
export type SuggestNewWordsInput = z.infer<typeof SuggestNewWordsInputSchema>;

export async function suggestNewWords(input: SuggestNewWordsInput): Promise<string[]> {
  const { category, numberOfWords } = input;
  const prompt = `Suggest ${numberOfWords} unique and interesting English words related to the category '${category}'. Your response must be only a single string of comma-separated words. For example: "resilience, empathy, determination, innovation, integrity". Do not add any other text or formatting.`;

  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${GENERATIVE_MODEL_NAME}`;
    
  const response = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Cloudflare AI API error:", errorText);
    throw new Error(`Cloudflare AI API request failed: ${response.statusText}`);
  }
  
  const jsonResponse = await response.json();
  const wordString = jsonResponse.result.response;

  if (wordString && typeof wordString === 'string') {
      return wordString.split(',').map(word => word.trim().replace(/"/g, ''));
  }
  return [];
}


// Gets details for a single word by making multiple, more reliable API calls
const WordDetailsInputSchema = z.object({
    word: z.string().describe("The English word to get details for."),
    category: z.string().describe("The category the word belongs to, for context.")
});

const WordDetailsOutputSchema = z.object({
    english: z.string().describe('The English word.'),
    arabic: z.string().describe('The Arabic translation of the word.'),
    definition: z.string().describe('The English definition of the word.'),
    arabicDefinition: z.string().describe('The Arabic definition of the word.'),
    example: z.string().describe('An example sentence using the word in English.'),
    arabicExample: z.string().describe('An example sentence using the word in Arabic.'),
});
export type WordDetailsOutput = z.infer<typeof WordDetailsOutputSchema>;

// Helper to query the generative model for a simple string response
async function queryGenerativeAI(prompt: string): Promise<string> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${GENERATIVE_MODEL_NAME}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
    });

    if (!response.ok) {
        throw new Error(`Cloudflare AI request failed: ${response.statusText}`);
    }
    const jsonResponse = await response.json();
    return jsonResponse.result.response.trim().replace(/"/g, ''); // Clean up response
}

export async function getWordDetails(input: z.infer<typeof WordDetailsInputSchema>): Promise<WordDetailsOutput | null> {
    const { word, category } = input;
    try {
        const definitionPrompt = `Provide a concise, dictionary-style definition for the English word "${word}" in the context of the category "${category}". Respond with ONLY the definition text.`;
        const examplePrompt = `Provide a clear and simple example sentence using the English word "${word}". Respond with ONLY the example sentence.`;

        // Run all API calls in parallel for efficiency
        const [
            definition,
            example,
            arabicTranslation
        ] = await Promise.all([
            queryGenerativeAI(definitionPrompt),
            queryGenerativeAI(examplePrompt),
            translateText({ text: word, targetLanguage: 'ar' })
        ]);

        const [
            arabicDefinition,
            arabicExample
        ] = await Promise.all([
            translateText({ text: definition, targetLanguage: 'ar' }),
            translateText({ text: example, targetLanguage: 'ar' })
        ]);

        return {
            english: word,
            arabic: arabicTranslation.translation,
            definition,
            arabicDefinition: arabicDefinition.translation,
            example,
            arabicExample: arabicExample.translation,
        };

    } catch (e) {
      console.error(`Failed to get all details for "${word}":`, e);
      return null;
    }
}
