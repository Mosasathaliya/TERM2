
'use server';

/**
 * @fileoverview Defines a consolidated pipeline for voice chat.
 * This flow takes audio data, transcribes it using Cloudflare Whisper,
 * gets a response from a text-generation model, and returns the text response.
 */
import { z } from 'zod';
import { runAi } from '@/lib/cloudflare-ai';

const getEnv = (k: string) => {
  const v = (process as any)?.env?.[k];
  if (!v) throw new Error(`${k} is not set`);
  return v;
};

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

// Cloudflare Speech-to-Text (Whisper)
async function transcribeAudio(audioBytes: Uint8Array): Promise<string> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${getEnv('CLOUDFLARE_ACCOUNT_ID')}/ai/run/@cf/openai/whisper`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getEnv('CLOUDFLARE_API_TOKEN')}`,
      'Content-Type': 'application/octet-stream',
    },
    body: audioBytes,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Cloudflare STT API error:', errorText);
    throw new Error(`Cloudflare STT API request failed: ${response.statusText}`);
  }

  const jsonResponse = await response.json();
  return jsonResponse.result.text as string;
}

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type Message = z.infer<typeof MessageSchema>;

const VoiceChatInputSchema = z.object({
  audioDataUri: z.string().describe("The user's audio speech as a data URI."),
  personality: z.string().describe("The agent's base personality."),
  userName: z.string().optional(),
  userInfo: z.string().optional(),
  history: z.array(MessageSchema),
});
export type VoiceChatInput = z.infer<typeof VoiceChatInputSchema>;

const VoiceChatOutputSchema = z.object({
  response: z.string().describe("The AI agent's final text response."),
  transcribedText: z.string().optional().describe("The transcribed text from the user's audio."),
});
export type VoiceChatOutput = z.infer<typeof VoiceChatOutputSchema>;

export async function runVoiceChatPipeline(input: VoiceChatInput): Promise<VoiceChatOutput> {
  const { audioDataUri, personality, userName, userInfo, history } = input;

  const base64 = audioDataUri.split(',')[1] ?? '';
  if (!base64) return { response: '', transcribedText: '' };
  const audioBytes = base64ToUint8Array(base64);
  const transcribedText = await transcribeAudio(audioBytes);

  // Ignore Arabic or non-English input: if Arabic chars present, return no response
  if (!transcribedText || /[\u0600-\u06FF]/.test(transcribedText)) {
    return { response: '', transcribedText: '' };
  }

  const userMessage: Message = { role: 'user', content: transcribedText };
  const currentHistory = [...history, userMessage];

  // English-only teacher that corrects mistakes politely and encourages speaking
  let systemPrompt = `You are an English speaking teacher. Always respond in English only.
Correct the user's mistakes gently (grammar, word choice, pronunciation hints if needed).
Keep responses concise, conversational, and include a short follow-up question to keep the dialogue going.
Personality: ${personality}.`;
  if (userName) systemPrompt += ` Address the user as ${userName}.`;
  if (userInfo) systemPrompt += ` User info: ${userInfo}.`;

  const messagesForApi = [
    { role: 'system', content: systemPrompt },
    ...currentHistory.map((msg) => ({ role: msg.role === 'model' ? 'assistant' : 'user', content: msg.content })),
  ];

  const response = await runAi({ model: '@cf/meta/llama-3-8b-instruct', inputs: { messages: messagesForApi } });
  const jsonResponse = await response.json();
  const responseText = jsonResponse.result.response as string;

  if (!responseText) {
    return { response: "", transcribedText };
  }

  return { response: responseText, transcribedText };
}
