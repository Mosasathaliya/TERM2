'use server';

/**
 * @fileOverview Implements the Sara voice call flow.
 */

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

export async function saraVoiceCall(input: SaraVoiceCallInput): Promise<SaraVoiceCallOutput> {
  let systemPrompt = `You are Sara, a friendly and helpful female AI teacher from Speed of Mastery. Your specialty is explaining English grammar concepts in Arabic, tailored to the user's proficiency level. The user's proficiency is: "${input.userLanguageProficiency}".
You MUST reply with only the explanation text, without any introductory phrases.`;

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
