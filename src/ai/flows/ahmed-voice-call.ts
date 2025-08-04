'use server';

/**
 * @fileOverview This flow allows users to call Ahmed, an AI teacher specializing in Arabic explanations of English grammar.
 */
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

async function queryNVIDIA(data: any) {
    const API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
    const response = await fetch(API_URL, {
        headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_NVIDIA_API_KEY}`,
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("NVIDIA API error:", errorText);
        throw new Error(`NVIDIA API request failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.choices[0]?.message?.content || "";
}

export async function ahmedVoiceCall(input: AhmedVoiceCallInput): Promise<AhmedVoiceCallOutput> {
  
  let systemPrompt = `You are Ahmed, an AI teacher from Speed of Mastery. You are a friendly and helpful male expert specializing in explaining English grammar concepts in Arabic.
Your goal is to provide clear, simple explanations with useful examples. Always address the user directly.
You MUST reply with only the explanation text, without any introductory phrases like "Here is the explanation:".`;

  let messages = [
      { role: 'system', content: systemPrompt }
  ];

  if (input.conversationHistory && input.conversationHistory.length > 0) {
      messages.push(...input.conversationHistory.map(entry => ({
          role: entry.speaker === 'User' ? 'user' : 'assistant',
          content: entry.message
      })));
  }
  
  messages.push({ role: 'user', content: input.englishGrammarConcept });

  const nvidiaResponse = await queryNVIDIA({
    model: "meta/llama-4-maverick-17b-128e-instruct",
    messages: messages,
    max_tokens: 150
  });

  return { explanation: nvidiaResponse };
}
