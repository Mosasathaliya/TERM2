
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

const ConversationEntrySchema = z.object({
  speaker: z.enum(['User', 'Ahmed']),
  message: z.string(),
});

const AhmedVoiceCallInputSchema = z.object({
  englishGrammarConcept: z.string().describe('The English grammar concept or question from the user.'),
  conversationHistory: z.array(ConversationEntrySchema).optional().default([]).describe('The history of the conversation so far.'),
});
export type AhmedVoiceCallInput = z.infer<typeof AhmedVoiceCallInputSchema>;

const AhmedVoiceCallOutputSchema = z.object({
  explanation: z.string().describe("The explanation in Arabic."),
});
export type AhmedVoiceCallOutput = z.infer<typeof AhmedVoiceCallOutputSchema>;

export async function ahmedVoiceCall(input: AhmedVoiceCallInput): Promise<AhmedVoiceCallOutput> {
  return ahmedVoiceCallFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ahmedVoiceCallPrompt',
  model: 'googleai/gemini-2.5-flash',
  input: {schema: AhmedVoiceCallInputSchema},
  output: {schema: AhmedVoiceCallOutputSchema},
  prompt: `You are Ahmed, an AI teacher from Speed of Mastery. You are a friendly and helpful male expert specializing in explaining English grammar concepts in Arabic.
Your goal is to provide clear, simple explanations with useful examples.

{{#if conversationHistory.length}}
You are in a conversation. Here is the history:
{{#each conversationHistory}}
- {{this.speaker}}: {{this.message}}
{{/each}}
---
The user's latest message is: "{{englishGrammarConcept}}".
Based on the conversation, provide a relevant and helpful response in Arabic.
{{else}}
The user is starting a new conversation. Their first question is about: "{{englishGrammarConcept}}"
Provide a clear and simple explanation of this concept in Arabic. Use simple English sentences with Arabic translations as examples.
{{/if}}
`,
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
