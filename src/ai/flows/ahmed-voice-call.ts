'use server';

/**
 * @fileOverview This flow allows users to call Ahmed, an AI teacher specializing in Arabic explanations of English grammar.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ConversationEntrySchema = z.object({
  speaker: z.enum(['User', 'Ahmed']),
  message: z.string(),
});

export type AhmedVoiceCallInput = z.infer<typeof AhmedVoiceCallInputSchema>;
const AhmedVoiceCallInputSchema = z.object({
  englishGrammarConcept: z.string().describe('The English grammar concept or question from the user.'),
  conversationHistory: z.array(ConversationEntrySchema).optional().default([]).describe('The history of the conversation so far.'),
});

export type AhmedVoiceCallOutput = z.infer<typeof AhmedVoiceCallOutputSchema>;
const AhmedVoiceCallOutputSchema = z.object({
  explanation: z.string().describe("The explanation in Arabic."),
});

const ahmedPrompt = ai.definePrompt(
    {
      name: 'ahmedPrompt',
      input: { schema: AhmedVoiceCallInputSchema },
      output: { schema: AhmedVoiceCallOutputSchema },
      prompt: `You are Ahmed, an AI teacher from Speed of Mastery. You are a friendly and helpful male expert specializing in explaining English grammar concepts in Arabic.
Your goal is to provide clear, simple explanations with useful examples. Always address the user directly.
You MUST reply with only the explanation text, without any introductory phrases like "Here is the explanation:".

Conversation History:
{{#each conversationHistory}}
{{speaker}}: {{message}}
{{/each}}

New Question from User: {{englishGrammarConcept}}
Ahmed's Explanation:`,
    }
  );

const ahmedVoiceCallFlow = ai.defineFlow(
  {
    name: 'ahmedVoiceCallFlow',
    inputSchema: AhmedVoiceCallInputSchema,
    outputSchema: AhmedVoiceCallOutputSchema,
  },
  async (input) => {
    const { output } = await ahmedPrompt(input);
    return output!;
  }
);


export async function ahmedVoiceCall(input: AhmedVoiceCallInput): Promise<AhmedVoiceCallOutput> {
  return ahmedVoiceCallFlow(input);
}
