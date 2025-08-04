
'use server';
/**
 * @fileOverview A conversational flow for a lesson-specific expert AI using Hugging Face.
 */

import { z } from 'zod';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct";

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

export type ExpertChatInput = z.infer<typeof ExpertChatInputSchema>;
const ExpertChatInputSchema = z.object({
  lessonTitle: z.string().describe('The title of the lesson being discussed.'),
  lessonExplanation: z.string().describe('The core explanation of the lesson topic.'),
  history: z.array(MessageSchema).describe('The previous conversation history.'),
  question: z.string().describe("The user's new question about the lesson."),
});

export type ExpertChatOutput = z.infer<typeof ExpertChatOutputSchema>;
const ExpertChatOutputSchema = z.object({
  answer: z.string().describe("The AI expert's answer to the question."),
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

function formatPrompt(systemPrompt: string, history: z.infer<typeof MessageSchema>[], question: string) {
    const historyString = history.map(msg => {
        if (msg.role === 'user') {
            return `<|user|>\n${msg.content}<|end|>`;
        } else {
            return `<|assistant|>\n${msg.content}<|end|>`;
        }
    }).join('\n');
    
    return `<|system|>\n${systemPrompt}<|end|>\n${historyString}\n<|user|>\n${question}<|end|>\n<|assistant|>`;
}

export async function expertChat(input: ExpertChatInput): Promise<ExpertChatOutput> {
    if (!HUGGING_FACE_API_KEY) {
        throw new Error("Hugging Face API key is not configured.");
    }

    const { lessonTitle, lessonExplanation, history, question } = input;
    
    const systemPrompt = `You are an expert English language tutor from Speed of Mastery. Your current topic is "${lessonTitle}".
    Your explanation for this topic is: "${lessonExplanation}".
    Answer the user's questions based on this topic. Be friendly, clear, and concise. Use the provided conversation history to understand the context of the user's new question.
    Keep your answers in Arabic unless the user asks for something in English.`;

    const formattedPrompt = formatPrompt(systemPrompt, history, question);

    const huggingFacePayload = {
        inputs: formattedPrompt,
        parameters: {
            max_new_tokens: 512,
            return_full_text: false,
        },
    };

    try {
        const result = await queryHuggingFace(huggingFacePayload);
        const answer = result[0]?.generated_text || "Sorry, I couldn't generate a response.";
        return { answer };
    } catch (error) {
        console.error("Expert chat error:", error);
        return { answer: "عذراً، لم أتمكن من إنشاء رد. الرجاء المحاولة مرة أخرى." };
    }
}
