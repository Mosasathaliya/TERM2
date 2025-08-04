
'use server';
/**
 * @fileOverview A flow for translating text, using Hugging Face.
 */

import { z } from 'zod';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct";


const TranslateInputSchema = z.object({
  text: z.string().describe('The text to be translated.'),
  targetLanguage: z.string().describe('The target language for translation (e.g., "Arabic").'),
});
export type TranslateInput = z.infer<typeof TranslateInputSchema>;

const TranslateOutputSchema = z.object({
    translation: z.string().describe('The translated text.'),
});
export type TranslateOutput = z.infer<typeof TranslateOutputSchema>;


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

// Export a wrapper function to be called from client-side components.
export async function translateText(
  input: TranslateInput
): Promise<TranslateOutput> {
   if (!HUGGING_FACE_API_KEY) {
        throw new Error("Hugging Face API key is not configured.");
    }

    const { text, targetLanguage } = input;
    const prompt = `Translate the following text to ${targetLanguage}. Do not add any extra commentary or quotation marks, just provide the direct translation.\n\nText: "${text}"`;

    const huggingFacePayload = {
        inputs: `<|system|>\nYou are a direct translation API. You only return the translated text.<|end|>\n<|user|>\n${prompt}<|end|>\n<|assistant|>`,
        parameters: {
            max_new_tokens: 512,
            return_full_text: false,
        },
    };
    
    try {
        const result = await queryHuggingFace(huggingFacePayload);
        const translation = result[0]?.generated_text.trim() || "Translation failed.";
        return { translation };
    } catch (error) {
        console.error("Translation error:", error);
        throw new Error("Failed to translate text.");
    }
}
