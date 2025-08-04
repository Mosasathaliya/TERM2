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

async function queryHuggingFace(data: any) {
    const API_URL = "https://api-inference.huggingface.co/models/gpt2";
    const response = await fetch(API_URL, {
        headers: {
            "Authorization": `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Hugging Face API error:", errorText);
        throw new Error(`Hugging Face API request failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result[0]?.generated_text || "";
}

export async function saraVoiceCall(input: SaraVoiceCallInput): Promise<SaraVoiceCallOutput> {
  let systemPrompt = `You are Sara, a friendly and helpful female AI teacher from Speed of Mastery. Your specialty is explaining English grammar concepts in Arabic, tailored to the user's proficiency level. The user's proficiency is: "${input.userLanguageProficiency}".
You MUST reply with only the explanation text, without any introductory phrases.`;

  if (input.conversationHistory && input.conversationHistory.length > 0) {
      systemPrompt += "\n\nYou are in a conversation. Adapt your response to the history and the user's latest message, keeping their proficiency level in mind.";
  } else {
      systemPrompt += `\n\nThe user is starting a new conversation. Provide a clear and simple explanation of their question, tailored to their proficiency level. Use simple English sentences with Arabic translations as examples.`;
  }

  const conversation = input.conversationHistory.map(entry => `${entry.speaker}: ${entry.message}`).join('\n');
  const fullPrompt = `${systemPrompt}\n\n${conversation}\nUser: ${input.englishGrammarConcept}\nSara:`;

  const hfResponse = await queryHuggingFace({
    inputs: fullPrompt,
    parameters: { max_new_tokens: 150, return_full_text: false }
  });

  return { explanation: hfResponse };
}
