'use server';

/**
 * @fileOverview Implements the Sara voice call flow.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ConversationEntrySchema = z.object({
  speaker: z.enum(['User', 'Sara']),
  message: z.string(),
});

export type SaraVoiceCallInput = z.infer<typeof SaraVoiceCallInputSchema>;
const SaraVoiceCallInputSchema = z.object({
  englishGrammarConcept: z.string().describe('The English grammar concept or question from the user.'),
  userLanguageProficiency: z.string().describe('The user\'s proficiency level in English.'),
  conversationHistory: z.array(ConversationEntrySchema).optional().default([]).describe('The history of the conversation so far.'),
});

export type SaraVoiceCallOutput = z.infer<typeof SaraVoiceCallOutputSchema>;
const SaraVoiceCallOutputSchema = z.object({
  explanation: z.string().describe('The explanation in Arabic, tailored to the user\'s proficiency.'),
});

const saraPrompt = ai.definePrompt(
  {
    name: 'saraPrompt',
    input: { schema: SaraVoiceCallInputSchema },
    output: { schema: SaraVoiceCallOutputSchema },
    prompt: `You are Sara, a friendly and helpful female AI teacher from Speed of Mastery. Your specialty is explaining English grammar concepts in Arabic, tailored to the user's proficiency level. The user's proficiency is: "{{userLanguageProficiency}}".
You MUST reply with only the explanation text, without any introductory phrases.

Conversation History:
{{#each conversationHistory}}
{{speaker}}: {{message}}
{{/each}}

New Question from User: {{englishGrammarConcept}}
Sara's Explanation:`,
  }
);

const saraVoiceCallFlow = ai.defineFlow(
  {
    name: 'saraVoiceCallFlow',
    inputSchema: SaraVoiceCallInputSchema,
    outputSchema: SaraVoiceCallOutputSchema,
  },
  async (input) => {
    const { output } = await saraPrompt(input);
    return output!;
  }
);

export async function saraVoiceCall(input: SaraVoiceCallInput): Promise<SaraVoiceCallOutput> {
  return saraVoiceCallFlow(input);
}
