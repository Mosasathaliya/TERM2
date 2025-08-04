
'use server';

/**
 * @fileOverview An AI agent for suggesting new vocabulary words and getting their details
 * using Cloudflare Workers AI.
 */
import { z } from 'zod';

const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN;
const MODEL_NAME = '@cf/meta/llama-3-8b-instruct';

function isBalanced(str: string) {
    const stack = [];
    const map: Record<string, string> = {
        '(': ')',
        '[': ']',
        '{': '}'
    };
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (map[char]) {
            stack.push(char);
        } else if (Object.values(map).includes(char)) {
            if (map[stack.pop()!] !== char) {
                return false;
            }
        }
    }
    return stack.length === 0;
}

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

  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${MODEL_NAME}`;
    
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


// Gets details for a single word
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


export async function getWordDetails(input: z.infer<typeof WordDetailsInputSchema>): Promise<WordDetailsOutput | null> {
    const { word, category } = input;
    const prompt = `Generate a JSON object for the English word "${word}" in the category "${category}". The object must have these exact keys: "english", "arabic", "definition", "arabicDefinition", "example", "arabicExample". Provide natural-sounding Arabic translations and a clear, simple example sentence. Do not output any text other than the JSON object.`;

    const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${MODEL_NAME}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], raw: true }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Cloudflare AI API error:", errorText);
        throw new Error(`Cloudflare AI API request failed: ${response.statusText}`);
    }
  
    const jsonResponse = await response.json();
    try {
      const responseText = jsonResponse.result.response;
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
          const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
           if (isBalanced(jsonString)) {
                return WordDetailsOutputSchema.parse(JSON.parse(jsonString));
           }
      }
      throw new Error("Incomplete or invalid JSON object found in response");
    } catch (e) {
      console.error("Failed to parse JSON from Cloudflare AI:", jsonResponse.result.response, e);
      return null;
    }
}
