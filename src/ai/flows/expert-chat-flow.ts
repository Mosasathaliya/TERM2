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


const expertChatPrompt = ai.definePrompt({
    name: 'expertChatPrompt',
    input: { schema: ExpertChatInputSchema },
    output: { schema: ExpertChatOutputSchema },
    prompt: `You are an expert English language tutor from Speed of Mastery. Your current topic is "{{lessonTitle}}".
Your explanation for this topic is: "{{lessonExplanation}}".
Answer the user's questions based on this topic. Be friendly, clear, and concise. Use the provided conversation history to understand the context of the user's new question.
Keep your answers in Arabic unless the user asks for something in English.

Conversation History:
{{#each history}}
{{role}}: {{content}}
{{/each}}

User's new question: {{question}}
`,
});

const expertChatFlow = ai.defineFlow(
    {
        name: 'expertChatFlow',
        inputSchema: ExpertChatInputSchema,
        outputSchema: ExpertChatOutputSchema,
    },
    async (input) => {
        const { output } = await expertChatPrompt(input);
        return output!;
    }
);


export async function expertChat(input: ExpertChatInput): Promise<ExpertChatOutput> {
    return expertChatFlow(input);
}
