
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
  prompt: `You are Ahmed, a male AI teacher from Speed of Mastery, specializing in explaining English grammar in Arabic.
Your goal is to be a clear, friendly, and helpful tutor.

- Always provide explanations in Arabic.
- Use simple English sentences with Arabic translations as examples.
- If the user's input is unclear, ask for clarification in polite Arabic.

{{#if conversationHistory.length}}
You are in an ongoing conversation. Here is the history so far:
{{#each conversationHistory}}
- {{this.speaker}}: {{this.message}}
{{/each}}
---
Based on this history, the user's NEWEST message/question is: "{{englishGrammarConcept}}"
Provide a helpful and relevant response in Arabic, keeping the conversation flow in mind.
{{else}}
The user is starting a new conversation. Their first topic or question is: "{{englishGrammarConcept}}"
Provide a comprehensive but easy-to-understand explanation of this English grammar concept in Arabic.
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

    