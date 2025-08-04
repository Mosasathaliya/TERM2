
'use server';

/**
 * @fileOverview This flow allows users to call Ahmed, an AI teacher specializing in Arabic explanations of English grammar.
 * It now uses the Hugging Face Inference API.
 */

import { z } from 'zod';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";

const ConversationEntrySchema = z.object({
  speaker: z.enum(['User', 'Ahmed']),
  message: z.string(),
});

export type AhmedVoiceCallInput = z.infer<typeof AhmedVoiceCallInputSchema>;
const AhmedVoiceCallInputSchema = z.object({
  englishGrammarConcept: z.string().describe('The English grammar concept or question from the user.'),
  conversationHistory: z.array(ConversationEntrySchema).optional().default([]).describe('The history of the conversation so far.'),
});

export type AhmedVoiceCallOutput = z.infer<typeof AhmedVoiceCallOutputSchema>;
const AhmedVoiceCallOutputSchema = z.object({
  explanation: z.string().describe("The explanation in Arabic."),
});

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

function formatPrompt(input: AhmedVoiceCallInput) {
    let prompt = `You are Ahmed, an AI teacher from Speed of Mastery. You are a friendly and helpful male expert specializing in explaining English grammar concepts in Arabic.
Your goal is to provide clear, simple explanations with useful examples. Always address the user directly.

You MUST reply with only the explanation text, without any introductory phrases like "Here is the explanation:".`;

    if (input.conversationHistory && input.conversationHistory.length > 0) {
        prompt += "\n\nYou are in a conversation. Here is the history:\n";
        prompt += input.conversationHistory.map(entry => `- ${entry.speaker}: ${entry.message}`).join('\n');
        prompt += `\n---\nThe user's latest message is: "${input.englishGrammarConcept}".\nBased on the conversation, provide a relevant and helpful response in Arabic.`;
    } else {
        prompt += `\n\nThe user is starting a new conversation. Their first question is about: "${input.englishGrammarConcept}"
Provide a clear and simple explanation of this concept in Arabic. Use simple English sentences with Arabic translations as examples.`;
    }

    return `<|system|>\n${prompt}<|end|>\n<|user|>\n${input.englishGrammarConcept}<|end|>\n<|assistant|>`;
}

export async function ahmedVoiceCall(input: AhmedVoiceCallInput): Promise<AhmedVoiceCallOutput> {
    if (!HUGGING_FACE_API_KEY) {
        throw new Error("Hugging Face API key is not configured.");
    }
    
    const huggingFacePayload = {
        inputs: formatPrompt(input),
        parameters: {
            max_new_tokens: 512,
            return_full_text: false,
        },
    };

    try {
        const result = await queryHuggingFace(huggingFacePayload);
        const explanation = result[0]?.generated_text || "عذراً، لم أتمكن من إنشاء رد.";
        return { explanation };
    } catch (error) {
        console.error("Ahmed Voice Call error:", error);
        return { explanation: "عذراً، حدث خطأ أثناء معالجة طلبك." };
    }
}
