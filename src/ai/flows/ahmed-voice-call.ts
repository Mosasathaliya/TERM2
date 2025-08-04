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

async function queryHuggingFace(data: any) {
    const API_URL = "https://api-inference.huggingface.co/models/gpt2";
    const response = await fetch(API_URL, {
        headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}`,
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
    // Extract the generated text from the result, which may be nested.
    return result[0]?.generated_text || "";
}

export async function ahmedVoiceCall(input: AhmedVoiceCallInput): Promise<AhmedVoiceCallOutput> {
  
  let systemPrompt = `You are Ahmed, an AI teacher from Speed of Mastery. You are a friendly and helpful male expert specializing in explaining English grammar concepts in Arabic.
Your goal is to provide clear, simple explanations with useful examples. Always address the user directly.
You MUST reply with only the explanation text, without any introductory phrases like "Here is the explanation:".`;

  if (input.conversationHistory && input.conversationHistory.length > 0) {
      systemPrompt += "\n\nYou are in a conversation. The user's latest message is a follow-up. Provide a relevant and helpful response in Arabic.";
  } else {
      systemPrompt += `\n\nThe user is starting a new conversation. Provide a clear and simple explanation of the concept they ask about in Arabic. Use simple English sentences with Arabic translations as examples.`;
  }
  
  const conversation = input.conversationHistory.map(entry => `${entry.speaker}: ${entry.message}`).join('\n');
  const fullPrompt = `${systemPrompt}\n\n${conversation}\nUser: ${input.englishGrammarConcept}\nAhmed:`;

  const hfResponse = await queryHuggingFace({
    inputs: fullPrompt,
    parameters: { max_new_tokens: 150, return_full_text: false }
  });

  return { explanation: hfResponse };
}
