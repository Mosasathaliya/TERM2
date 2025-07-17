
'use server';

/**
 * @fileOverview This flow allows users to call Ahmed, an AI teacher specializing in Arabic explanations of English grammar.
 *
 * - ahmedVoiceCall - A function to initiate a voice call with Ahmed.
 * - AhmedVoiceCallInput - The input type for the ahmedVoiceCall function.
 * - AhmedVoiceCallOutput - The return type for the ahmedVoiceCall function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

// Define the schema for a single conversation entry
const ConversationEntrySchema = z.object({
  speaker: z.enum(['User', 'Ahmed']), // Speaker can be User or Ahmed
  message: z.string(),
});

// Define the input schema for Ahmed's voice call, including conversation history
const AhmedVoiceCallInputSchema = z.object({
  englishGrammarConcept: z
    .string()
    .describe('The English grammar concept or question from the user. This might be in English, Arabic, or a garbled version from speech-to-text.'),
  conversationHistory: z.array(ConversationEntrySchema).optional().describe('The history of the conversation so far, to provide context for follow-up questions.'),
});
export type AhmedVoiceCallInput = z.infer<typeof AhmedVoiceCallInputSchema>;

const AhmedVoiceCallOutputSchema = z.object({
  explanation: z
    .string()
    .describe('The explanation of the English grammar concept in Arabic, or an answer to the user\'s question.'),
});
export type AhmedVoiceCallOutput = z.infer<typeof AhmedVoiceCallOutputSchema>;

export async function ahmedVoiceCall(input: AhmedVoiceCallInput): Promise<AhmedVoiceCallOutput> {
  return ahmedVoiceCallFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ahmedVoiceCallPrompt',
  input: {schema: AhmedVoiceCallInputSchema},
  output: {schema: AhmedVoiceCallOutputSchema},
  prompt: `You are Ahmed, an AI teacher from Speed of Mastery, specializing in explaining English grammar concepts in Arabic. You are male.

Your primary goal is to help the user understand English grammar.
- Always provide clear, concise explanations in Arabic.
- Use simple English examples with Arabic translations to illustrate the concepts.
- If the user asks a question, answer it directly in the context of the conversation.
- If the user's input is unclear, ask for clarification in polite Arabic.

{{#if conversationHistory.length}}
You are in an ongoing conversation. Here is the history so far:
{{#each conversationHistory}}
- {{this.speaker}}: {{this.message}}
{{/each}}
---
The user's NEWEST message/question is: "{{englishGrammarConcept}}"
Your task is to provide a helpful and relevant response in Arabic, based on their latest message and the conversation context.
{{else}}
The user is starting a new conversation. Their first topic or question is: "{{englishGrammarConcept}}"
Your task is to provide a comprehensive but easy-to-understand explanation of this English grammar concept in Arabic.
{{/if}}`,
});

const ahmedVoiceCallFlow = ai.defineFlow(
  {
    name: 'ahmedVoiceCallFlow',
    inputSchema: AhmedVoiceCallInputSchema,
    outputSchema: AhmedVoiceCallOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
