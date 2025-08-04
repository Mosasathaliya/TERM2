
'use server';
/**
 * @fileOverview This flow generates a detailed Arabic explanation for a specific English grammar topic.
 */
import { z } from 'zod';

const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN;
const MODEL_NAME = '@cf/meta/llama-3-8b-instruct';


async function queryCloudflare(prompt: string): Promise<any> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${MODEL_NAME}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are an expert English grammar teacher who is fluent in both English and Arabic. Your task is to provide a clear, comprehensive, and natural-sounding explanation of a given English grammar topic entirely in Arabic.'},
            { role: 'user', content: prompt }
          ]
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Cloudflare AI API error:", errorText);
        throw new Error(`Cloudflare AI API request failed: ${response.statusText}`);
    }
    
    const jsonResponse = await response.json();
    return jsonResponse.result.response;
}

export type GenerateExplanationInput = z.infer<typeof GenerateExplanationInputSchema>;
const GenerateExplanationInputSchema = z.object({
  grammarTopic: z.string().describe('The specific English grammar topic to be explained.'),
  level: z.string().describe('The level of the student (e.g., Beginner, Intermediate).')
});

export type GenerateExplanationOutput = {
  arabicExplanation: string;
};

export async function generateArabicExplanation(input: GenerateExplanationInput): Promise<GenerateExplanationOutput> {
  const { grammarTopic, level } = input;
  
  const prompt = `Please provide a detailed explanation in Arabic for the following English grammar topic: "${grammarTopic}".
The explanation should be clear, easy to understand, and suitable for a student at the "${level}" level.
Use examples where appropriate to illustrate the concepts.
Your response should ONLY be the Arabic explanation text, without any introductory phrases like "Here is the explanation:".`;

  const explanation = await queryCloudflare(prompt);
  
  return { arabicExplanation: explanation };
}
