
'use server';

/**
 * @fileoverview Defines a consolidated pipeline for voice chat.
 * This flow handles speech-to-text, persona contextualization, and response generation.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';

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


async function transcribeAudio(dataUri: string): Promise<string> {
    const { text } = await ai.stt({
        model: googleAI.model('gemini-1.5-flash'),
        media: {
            url: dataUri,
        },
    });
    return text;
}

async function generateResponse(systemPrompt: string, history: Message[], newUserText: string): Promise<string> {
  const { response } = await ai.generate({
    model: 'gemini-1.5-flash',
    system: systemPrompt,
    history: [...history, { role: 'user', content: newUserText }],
  });
  return response.text;
}

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

  // Step 1: Transcribe audio to text
  const transcribedText = await transcribeAudio(audioDataUri);

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

  // Step 3: Generate the personalized response
  const responseText = await generateResponse(systemPrompt, history, transcribedText);
  
  if (!responseText) {
    return { response: "I'm sorry, I don't have a response for that.", transcribedText: transcribedText };
  }

  return { 
    response: responseText,
    transcribedText: transcribedText,
  };
}
