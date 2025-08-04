'use server';

/**
 * @fileOverview Implements the Sara voice call flow using Cloudflare Workers AI.
 */
import { z } from 'zod';

const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN;
const MODEL_NAME = '@cf/meta/llama-3-8b-instruct';

async function queryCloudflare(messages: { role: string; content: string }[]): Promise<any> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${MODEL_NAME}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Cloudflare AI API error:", errorText);
        throw new Error(`Cloudflare AI API request failed: ${response.statusText}`);
    }
    
    const jsonResponse = await response.json();
    return jsonResponse.result.response;
}


const ConversationEntrySchema = z.object({
  speaker: z.enum(['User', 'Sara']),
  message: z.string(),
});

export type SaraVoiceCallInput = z.infer<typeof SaraVoiceCallInputSchema>;
const SaraVoiceCallInputSchema = z.object({
  englishGrammarConcept: z.string().describe('The English grammar concept or question from the user.'),
  userLanguageProficiency: z.string().describe("The user's proficiency level in English."),
  conversationHistory: z.array(ConversationEntrySchema).optional().default([]).describe('The history of the conversation so far.'),
});

export type SaraVoiceCallOutput = {
  explanation: string;
};

export async function saraVoiceCall(input: SaraVoiceCallInput): Promise<SaraVoiceCallOutput> {
  const { englishGrammarConcept, userLanguageProficiency, conversationHistory } = input;
  
  const systemPrompt = `You are Sara, a friendly and helpful female AI teacher from Speed of Mastery. Your specialty is explaining English grammar concepts in Arabic, tailored to the user's proficiency level. The user's proficiency is: "${userLanguageProficiency}".
You MUST reply with only the explanation text, without any introductory phrases.`;

  const history = conversationHistory.map(entry => ({
      role: entry.speaker === 'User' ? 'user' : 'assistant',
      content: entry.message
  }));

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: englishGrammarConcept },
  ];

  const explanation = await queryCloudflare(messages);

  return { explanation };
}
