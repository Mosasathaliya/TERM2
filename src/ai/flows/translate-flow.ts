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

// Export a wrapper function to be called from client-side components.
export async function translateText({ text, targetLanguage }: TranslateInput): Promise<TranslateOutput> {
    const prompt = `Translate the following English text to ${targetLanguage}. Do not add any extra commentary or quotation marks, just provide the direct translation.\n\nEnglish Text: "${text}"\n\n${targetLanguage} Translation:`;
    
    const translation = await queryHuggingFace({
      inputs: prompt,
      parameters: { max_new_tokens: 50, return_full_text: false }
    });
    
    return { translation: translation.trim() };
}
