'use server';

/**
 * @fileOverview This flow allows users to call Ahmed, an AI teacher specializing in Arabic explanations of English grammar.
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
  speaker: z.enum(['User', 'Ahmed']),
  message: z.string(),
});

export type AhmedVoiceCallInput = z.infer<typeof AhmedVoiceCallInputSchema>;
const AhmedVoiceCallInputSchema = z.object({
  englishGrammarConcept: z.string().describe('The English grammar concept or question from the user.'),
  conversationHistory: z.array(ConversationEntrySchema).optional().default([]).describe('The history of the conversation so far.'),
});

export type AhmedVoiceCallOutput = {
  explanation: string;
};

export async function ahmedVoiceCall(input: AhmedVoiceCallInput): Promise<AhmedVoiceCallOutput> {
  const { englishGrammarConcept, conversationHistory } = input;

  const systemPrompt = `You are Ahmed, an expert AI teacher from Speed of Mastery. Your personality is friendly, helpful, and patient.
You are a master of both English and Arabic. Your specialty is explaining English grammar concepts using clear, simple, and natural-sounding Arabic.
Your goal is to provide explanations that are easy for an Arabic speaker to understand. Use useful examples to illustrate your points.
Address the user directly and conversationally.
You MUST reply with ONLY the explanation text, without any introductory phrases like "Here is the explanation:".`;
  
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
