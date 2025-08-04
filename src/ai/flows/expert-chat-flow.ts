'use server';
/**
 * @fileOverview A conversational flow for a lesson-specific expert AI.
 */

import { z } from 'zod';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ExpertChatInputSchema = z.object({
  lessonTitle: z.string().describe('The title of the lesson being discussed.'),
  lessonExplanation: z.string().describe('The core explanation of the lesson topic.'),
  history: z.array(MessageSchema).describe('The previous conversation history.'),
  question: z.string().describe("The user's new question about the lesson."),
});
export type ExpertChatInput = z.infer<typeof ExpertChatInputSchema>;

const ExpertChatOutputSchema = z.object({
  answer: z.string().describe("The AI expert's answer to the question."),
});
export type ExpertChatOutput = z.infer<typeof ExpertChatOutputSchema>;


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

export async function expertChat(input: ExpertChatInput): Promise<ExpertChatOutput> {
    const { lessonTitle, lessonExplanation, history, question } = input;
    
    const systemPrompt = `You are an expert English language tutor from Speed of Mastery. Your current topic is "${lessonTitle}".
    Your explanation for this topic is: "${lessonExplanation}".
    Answer the user's questions based on this topic. Be friendly, clear, and concise. Use the provided conversation history to understand the context of the user's new question.
    Keep your answers in Arabic unless the user asks for something in English.`;

    const messages = [
        { role: 'system', content: systemPrompt },
        ...history.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: question }
    ];

    const answer = await queryNVIDIA({
        model: "meta/llama-4-maverick-17b-128e-instruct",
        messages: messages,
        max_tokens: 150
    });

    return { answer };
}
