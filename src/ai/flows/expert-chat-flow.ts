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

export async function expertChat(input: ExpertChatInput): Promise<ExpertChatOutput> {
    const { lessonTitle, lessonExplanation, history, question } = input;
    
    const systemPrompt = `You are an expert English language tutor from Speed of Mastery. Your current topic is "${lessonTitle}".
    Your explanation for this topic is: "${lessonExplanation}".
    Answer the user's questions based on this topic. Be friendly, clear, and concise. Use the provided conversation history to understand the context of the user's new question.
    Keep your answers in Arabic unless the user asks for something in English.`;

    const conversation = history.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    const fullPrompt = `${systemPrompt}\n\n${conversation}\nuser: ${question}\nmodel:`;

    const answer = await queryHuggingFace({
        inputs: fullPrompt,
        parameters: { max_new_tokens: 150, return_full_text: false }
    });

    return { answer };
}
