
'use server';
/**
 * @fileOverview A conversational flow for a lesson-specific expert AI.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

export const ExpertChatInputSchema = z.object({
  lessonTitle: z.string().describe('The title of the lesson being discussed.'),
  lessonExplanation: z.string().describe('The core explanation of the lesson topic.'),
  history: z.array(MessageSchema).describe('The previous conversation history.'),
  question: z.string().describe("The user's new question about the lesson."),
});
export type ExpertChatInput = z.infer<typeof ExpertChatInputSchema>;

export const ExpertChatOutputSchema = z.object({
  answer: z.string().describe("The AI expert's answer to the question."),
});
export type ExpertChatOutput = z.infer<typeof ExpertChatOutputSchema>;


export const expertChat = ai.defineFlow(
  {
    name: 'expertChat',
    inputSchema: ExpertChatInputSchema,
    outputSchema: ExpertChatOutputSchema,
  },
  async (input) => {
    const { lessonTitle, lessonExplanation, history, question } = input;
    const { response } = await ai.generate({
      model: 'gemini-1.5-flash',
      history: [
        {
          role: 'system',
          content: `You are an expert English language tutor from Speed of Mastery. Your current topic is "${lessonTitle}".
    Your explanation for this topic is: "${lessonExplanation}".
    Answer the user's questions based on this topic. Be friendly, clear, and concise. Use the provided conversation history to understand the context of the user's new question.
    Keep your answers in Arabic unless the user asks for something in English.`,
        },
        ...history,
        {
          role: 'user',
          content: question,
        },
      ],
    });

    return { answer: response.text };
  }
);
