
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

export async function ahmedVoiceCall(input: AhmedVoiceCallInput): Promise<AhmedVoiceCallOutput> {
  
  let systemPrompt = `You are Ahmed, an AI teacher from Speed of Mastery. You are a friendly and helpful male expert specializing in explaining English grammar concepts in Arabic.
Your goal is to provide clear, simple explanations with useful examples. Always address the user directly.
You MUST reply with only the explanation text, without any introductory phrases like "Here is the explanation:".`;

  if (input.conversationHistory && input.conversationHistory.length > 0) {
      systemPrompt += "\n\nYou are in a conversation. The user's latest message is a follow-up. Provide a relevant and helpful response in Arabic.";
  } else {
      systemPrompt += `\n\nThe user is starting a new conversation. Provide a clear and simple explanation of the concept they ask about in Arabic. Use simple English sentences with Arabic translations as examples.`;
  }
  
  const history = input.conversationHistory.map(entry => ({
      role: entry.speaker === 'User' ? 'user' : 'model',
      content: entry.message
  }));

  const { response } = await ai.generate({
      model: 'gemini-1.5-flash',
      system: systemPrompt,
      history: [...history, { role: 'user', content: input.englishGrammarConcept }],
  });

  return { explanation: response.text };
}
