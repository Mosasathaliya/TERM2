
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

// Define the schema for a single conversation entry
const ConversationEntrySchema = z.object({
  speaker: z.enum(['User', 'Sara']), // Speaker can be User or Sara
  message: z.string(),
});

// Define the input schema for Sara's voice call, including conversation history
const SaraVoiceCallInputSchema = z.object({
  englishGrammarConcept: z.string().describe('The English grammar concept or question from the user. This might be in English, Arabic, or a garbled version from speech-to-text.'),
  userLanguageProficiency: z.string().describe('The user\u0027s proficiency level in English.'),
  conversationHistory: z.array(ConversationEntrySchema).optional().describe('The history of the conversation so far, to provide context for follow-up questions.'),
});
export type SaraVoiceCallInput = z.infer<typeof SaraVoiceCallInputSchema>;

const SaraVoiceCallOutputSchema = z.object({
  explanation: z.string().describe('The explanation of the English grammar concept in Arabic, or an answer to the user\'s question, tailored to their proficiency.'),
});
export type SaraVoiceCallOutput = z.infer<typeof SaraVoiceCallOutputSchema>;

export async function saraVoiceCall(input: SaraVoiceCallInput): Promise<SaraVoiceCallOutput> {
  return saraVoiceCallFlow(input);
}

const prompt = ai.definePrompt({
  name: 'saraVoiceCallPrompt',
  input: {schema: SaraVoiceCallInputSchema},
  output: {schema: SaraVoiceCallOutputSchema},
  prompt: `You are Sara, an AI teacher specializing in explaining English grammar concepts in Arabic. Address yourself as AI teacher from speed of Mastery and female.

The user's proficiency level in English is: "{{{userLanguageProficiency}}}"

{{#if conversationHistory.length}}
You are in an ongoing conversation. Here's the history so far:
{{#each conversationHistory}}
- {{this.speaker}}: {{this.message}}
{{/each}}
---
The user's NEWEST message/question, building on this conversation, is: "{{{englishGrammarConcept}}}"
Your task is to understand this newest message in the context of the conversation history AND the user's proficiency level. Provide a clear, concise, and helpful explanation or answer in Arabic, tailored to their proficiency. If the newest message is a greeting or unrelated, respond politely. If the question is unclear, ask for clarification in Arabic.
{{else}}
The user is starting a new conversation. Their first message/question is about the English grammar concept: "{{{englishGrammarConcept}}}"
This input might be in English, Arabic, or a garbled version from speech-to-text.
Your task is to interpret this first message, considering the user's proficiency level, to identify the most likely English grammar concept they are asking about. Then, provide a comprehensive but easy-to-understand explanation of that concept in Arabic, tailored to their proficiency. Include simple English examples with Arabic translations. If the input is too unclear, politely ask for clarification in Arabic.
{{/if}}`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
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
