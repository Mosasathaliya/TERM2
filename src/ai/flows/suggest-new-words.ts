
'use server';

/**
 * @fileOverview An AI agent for suggesting new vocabulary words based on a given category using Cloudflare Workers AI.
 */
import { z } from 'zod';

const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN;
const MODEL_NAME = '@cf/meta/llama-3-8b-instruct';

async function queryCloudflare(prompt: string, numberOfWords: number): Promise<any> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${MODEL_NAME}`;
    
    const messages = [
        {
            role: "system",
            content: `You are a vocabulary expert. Your task is to generate a JSON array of word objects. Each object must have keys "english", "arabic", "definition", "arabicDefinition", "example", and "arabicExample". The array should contain exactly ${numberOfWords} objects. Do not output any text other than the JSON array.`
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
    try {
      const responseText = jsonResponse.result.response;
      const jsonStart = responseText.indexOf('[');
      const jsonEnd = responseText.lastIndexOf(']');
      if (jsonStart !== -1 && jsonEnd !== -1) {
          return JSON.parse(responseText.substring(jsonStart, jsonEnd + 1));
      }
      throw new Error("No valid JSON array found in response");
    } catch (e) {
      console.error("Failed to parse JSON from Cloudflare AI:", jsonResponse.result.response, e);
      throw new Error("Failed to parse JSON from AI response.");
    }
}


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

export async function suggestNewWords(input: SuggestNewWordsInput): Promise<SuggestNewWordsOutput> {
  const { category, numberOfWords } = input;
  const prompt = `Suggest ${numberOfWords} new English words related to the category '${category}'.`;
  const output = await queryCloudflare(prompt, numberOfWords);
  return output;
}
