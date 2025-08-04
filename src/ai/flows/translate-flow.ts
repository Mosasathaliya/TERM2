'use server';
/**
 * @fileOverview A flow for translating text.
 */
import { z } from 'zod';

export type TranslateInput = z.infer<typeof TranslateInputSchema>;
const TranslateInputSchema = z.object({
  text: z.string().describe('The text to be translated.'),
  targetLanguage: z.string().describe('The target language for translation (e.g., "Arabic").'),
});

export type TranslateOutput = z.infer<typeof TranslateOutputSchema>;
const TranslateOutputSchema = z.object({
    translation: z.string().describe('The translated text.'),
});

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

// Export a wrapper function to be called from client-side components.
export async function translateText({ text, targetLanguage }: TranslateInput): Promise<TranslateOutput> {
    const prompt = `Translate the following English text to ${targetLanguage}. Do not add any extra commentary or quotation marks, just provide the direct translation.\n\nEnglish Text: "${text}"\n\n${targetLanguage} Translation:`;
    
    const translation = await queryNVIDIA({
        model: "meta/llama-4-maverick-17b-128e-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
    });
    
    return { translation: translation.trim() };
}
