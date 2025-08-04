
'use server';

/**
 * @fileOverview Implements the Sara voice call flow, using the Hugging Face Inference API.
 */

import { z } from 'zod';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct";

const ConversationEntrySchema = z.object({
  speaker: z.enum(['User', 'Sara']),
  message: z.string(),
});

export type SaraVoiceCallInput = z.infer<typeof SaraVoiceCallInputSchema>;
const SaraVoiceCallInputSchema = z.object({
  englishGrammarConcept: z.string().describe('The English grammar concept or question from the user.'),
  userLanguageProficiency: z.string().describe('The user\'s proficiency level in English.'),
  conversationHistory: z.array(ConversationEntrySchema).optional().default([]).describe('The history of the conversation so far.'),
});

export type SaraVoiceCallOutput = z.infer<typeof SaraVoiceCallOutputSchema>;
const SaraVoiceCallOutputSchema = z.object({
  explanation: z.string().describe('The explanation in Arabic, tailored to the user\'s proficiency.'),
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

function formatPrompt(input: SaraVoiceCallInput) {
    let prompt = `You are Sara, a friendly and helpful female AI teacher from Speed of Mastery. Your specialty is explaining English grammar concepts in Arabic, tailored to the user's proficiency level. Always address the user directly.
The user's proficiency level is: "${input.userLanguageProficiency}".
You MUST reply with only the explanation text, without any introductory phrases.`;

    if (input.conversationHistory && input.conversationHistory.length > 0) {
        prompt += "\n\nYou are in a conversation. Here's the history:\n";
        prompt += input.conversationHistory.map(entry => `- ${entry.speaker}: ${entry.message}`).join('\n');
        prompt += `\n---\nThe user's latest message is: "${input.englishGrammarConcept}".\nBased on the conversation, provide a relevant and helpful response in Arabic, adapting the complexity to their proficiency level.`;
    } else {
        prompt += `\n\nThe user is starting a new conversation. Their first question is about: "${input.englishGrammarConcept}"
Provide a clear and simple explanation of this concept in Arabic, tailored to their proficiency level. Use simple English sentences with Arabic translations as examples.`;
    }

    return `<|system|>\n${prompt}<|end|>\n<|user|>\n${input.englishGrammarConcept}<|end|>\n<|assistant|>`;
}

export async function saraVoiceCall(input: SaraVoiceCallInput): Promise<SaraVoiceCallOutput> {
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
        console.error("Sara Voice Call error:", error);
        return { explanation: "عذراً، حدث خطأ أثناء معالجة طلبك." };
    }
}
