
'use server';
/**
 * @fileOverview A conversational flow for a lesson-specific expert AI.
 *
 * - expertChat - A function that handles the chat interaction with memory.
 * - ExpertChatInput - The input type for the expertChat function.
 * - ExpertChatOutput - The return type for the expertChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

// Define a schema for a single chat message
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


const expertChatFlow = ai.defineFlow(
  {
    name: 'expertChatFlow',
    inputSchema: ExpertChatInputSchema,
    outputSchema: ExpertChatOutputSchema,
  },
  async ({ lessonTitle, lessonExplanation, history, question }) => {
    const systemPrompt = `You are an expert English language tutor from Speed of Mastery. Your current topic is "${lessonTitle}".
    Your explanation for this topic is: "${lessonExplanation}".
    Answer the user's questions based on this topic. Be friendly, clear, and concise. Use the provided conversation history to understand the context of the user's new question.
    Keep your answers in Arabic unless the user asks for something in English.`;

    const response = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        system: systemPrompt,
        prompt: question,
        history,
    });
    
    const text = response.text;
    if (!text) {
        // Handle cases where the model might not return text, e.g., due to safety filters.
        return { answer: "عذراً، لم أتمكن من إنشاء رد. الرجاء المحاولة مرة أخرى." };
    }
    
    return { answer: text };
  }
);

export async function expertChat(input: ExpertChatInput): Promise<ExpertChatOutput> {
  return expertChatFlow(input);
}
