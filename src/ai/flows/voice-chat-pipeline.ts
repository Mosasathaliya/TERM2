'use server';

/**
 * @fileoverview Defines a consolidated pipeline for voice chat using Cloudflare AI for text generation.
 * This flow handles speech-to-text (STT remains a Genkit feature for now) and response generation.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN;
const MODEL_NAME = '@cf/mistral/mistral-7b-instruct-v0.1';

// Cloudflare text generation
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


// Define a schema for a single chat message, which will be used for history
const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type Message = z.infer<typeof MessageSchema>;

// Input schema for the consolidated pipeline
const VoiceChatInputSchema = z.object({
  audioDataUri: z.string().describe("The audio data to be transcribed, as a data URI."),
  personality: z.string().describe("The agent's base personality."),
  userName: z.string().optional(),
  userInfo: z.string().optional(),
  history: z.array(MessageSchema),
});
export type VoiceChatInput = z.infer<typeof VoiceChatInputSchema>;

// Output schema for the consolidated pipeline
const VoiceChatOutputSchema = z.object({
  response: z.string().describe("The AI agent's final text response."),
  transcribedText: z.string().describe("The transcribed text from the user's audio."),
});
export type VoiceChatOutput = z.infer<typeof VoiceChatOutputSchema>;


/**
 * An exported async function that runs the voice chat pipeline.
 * This is the function that will be called from the application's frontend.
 * @param input - The voice chat input data.
 * @returns A promise that resolves to the AI's final text response and the transcription.
 */
export async function runVoiceChatPipeline(
  input: VoiceChatInput
): Promise<VoiceChatOutput> {
  const { audioDataUri, personality, userName, userInfo, history } = input;
        
  // Step 1: Transcribe audio to text (using Genkit's STT as it's separate from text generation)
  const sttResult = await ai.stt({
      media: {
          url: audioDataUri,
      }
  });
  const transcribedText = sttResult.text;

  if (!transcribedText || !transcribedText.trim()) {
      return { response: "", transcribedText: "" };
  }

  // Step 2: Construct the system prompt for the AI's persona
  let systemPrompt = `You are an AI with the following personality: ${personality}.`;
  if (userName) {
      systemPrompt += ` Address the user as ${userName}.`;
  }
  if (userInfo) {
      systemPrompt += ` Here is some information about the user you are talking to: ${userInfo}.`;
  }
  systemPrompt += ` Keep your responses concise and conversational.`

  // Step 3: Generate the personalized response using Cloudflare
  const messagesForApi = [
    { role: 'system', content: systemPrompt },
    ...history.map(msg => ({ role: msg.role === 'model' ? 'assistant' : 'user', content: msg.content })),
    { role: 'user', content: transcribedText },
  ];

  const responseText = await queryCloudflare(messagesForApi as any);

  if (!responseText) {
      return { response: "I'm sorry, I don't have a response for that.", transcribedText: transcribedText };
  }

  return { 
      response: responseText,
      transcribedText: transcribedText,
  };
}
