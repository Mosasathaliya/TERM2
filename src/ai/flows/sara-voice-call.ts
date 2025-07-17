
'use server';

/**
 * @fileOverview Implements the Sara voice call flow, providing an AI teacher specialized in Arabic explanations of English grammar.
 *
 * - saraVoiceCall - A function that initiates the voice call with Sara.
 * - SaraVoiceCallInput - The input type for the saraVoiceCall function.
 * - SaraVoiceCallOutput - The return type for the saraVoiceCall function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ConversationEntrySchema = z.object({
  speaker: z.enum(['User', 'Sara']),
  message: z.string(),
});

const SaraVoiceCallInputSchema = z.object({
  englishGrammarConcept: z.string().describe('The English grammar concept or question from the user.'),
  userLanguageProficiency: z.string().describe('The user\u0027s proficiency level in English.'),
  conversationHistory: z.array(ConversationEntrySchema).optional().default([]).describe('The history of the conversation so far.'),
});
export type SaraVoiceCallInput = z.infer<typeof SaraVoiceCallInputSchema>;

const SaraVoiceCallOutputSchema = z.object({
  explanation: z.string().describe('The explanation in Arabic, tailored to the user\'s proficiency.'),
});
export type SaraVoiceCallOutput = z.infer<typeof SaraVoiceCallOutputSchema>;

export async function saraVoiceCall(input: SaraVoiceCallInput): Promise<SaraVoiceCallOutput> {
  return saraVoiceCallFlow(input);
}

const prompt = ai.definePrompt({
  name: 'saraVoiceCallPrompt',
  model: 'googleai/gemini-2.5-flash',
  input: {schema: SaraVoiceCallInputSchema},
  output: {schema: SaraVoiceCallOutputSchema},
  prompt: `You are Sara, a friendly and helpful female AI teacher from Speed of Mastery. Your specialty is explaining English grammar concepts in Arabic, tailored to the user's proficiency level. Always address the user directly.

The user's proficiency level is: "{{{userLanguageProficiency}}}"

{{#if conversationHistory.length}}
You are in a conversation. Here's the history:
{{#each conversationHistory}}
- {{this.speaker}}: {{this.message}}
{{/each}}
---
The user's latest message is: "{{{englishGrammarConcept}}}"
Based on the conversation, provide a relevant and helpful response in Arabic, adapting the complexity to their proficiency level.
{{else}}
The user is starting a new conversation. Their first question is about: "{{{englishGrammarConcept}}}"
Provide a clear and simple explanation of this concept in Arabic, tailored to their proficiency level. Use simple English sentences with Arabic translations as examples.
{{/if}}
`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
    ],
  },
});

const saraVoiceCallFlow = ai.defineFlow(
  {
    name: 'saraVoiceCallFlow',
    inputSchema: SaraVoiceCallInputSchema,
    outputSchema: SaraVoiceCallOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
