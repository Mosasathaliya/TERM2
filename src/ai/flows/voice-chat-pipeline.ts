
'use server';

/**
 * @fileOverview Defines a consolidated Genkit flow for the entire voice chat pipeline.
 * This flow handles speech-to-text, persona contextualization, and response generation
 * in a more optimized sequence.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import type { Message } from './personalize-agent-response';

// Input schema for the consolidated pipeline
const VoiceChatInputSchema = z.object({
  audioDataUri: z.string().describe("The audio data to be transcribed, as a data URI."),
  personality: z.string().describe("The agent's base personality."),
  userName: z.string().optional(),
  userInfo: z.string().optional(),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })),
});
export type VoiceChatInput = z.infer<typeof VoiceChatInputSchema>;

// Output schema for the consolidated pipeline
const VoiceChatOutputSchema = z.object({
  response: z.string().describe("The AI agent's final text response."),
  transcribedText: z.string().describe("The transcribed text from the user's audio."),
});
export type VoiceChatOutput = z.infer<typeof VoiceChatOutputSchema>;


// Define the consolidated Genkit flow
const voiceChatPipelineFlow = ai.defineFlow(
  {
    name: 'voiceChatPipelineFlow',
    inputSchema: VoiceChatInputSchema,
    outputSchema: VoiceChatOutputSchema,
  },
  async ({ audioDataUri, personality, userName, userInfo, history }) => {
    // Step 1: Transcribe audio to text
    const { text: transcribedText } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: [
        {text: 'Transcribe the following audio to text.'},
        {media: {url: audioDataUri}},
      ],
    });

    if (!transcribedText || !transcribedText.trim()) {
      return { response: "", transcribedText: "" }; // Return empty if transcription is empty
    }
    
    // Step 2: Construct the system prompt for the AI's persona
    let systemPrompt = `You are an AI with the following personality: ${personality}.`;
    if (userName) {
      systemPrompt += ` Address the user as ${userName}.`;
    }
    if (userInfo) {
      systemPrompt += ` Here is some information about the user you are talking to: ${userInfo}.`;
    }

    // Step 3: Add the new user message to the history for the LLM call
    const llmHistory: Message[] = [...history, { role: 'user', content: transcribedText }];


    // Step 4: Generate the personalized response using the full context
    const response = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        system: systemPrompt,
        // The prompt is the last user message, but history provides the full context
        prompt: transcribedText,
        history: history, // Send the history *before* the current user message
    });
    
    const responseText = response.text;
    if (!responseText) {
      return { response: "I'm sorry, I don't have a response for that.", transcribedText: transcribedText };
    }

    return { 
      response: responseText,
      transcribedText: transcribedText,
    };
  }
);


/**
 * An exported async function that wraps the Genkit flow.
 * This is the function that will be called from the application's frontend.
 * @param input - The voice chat input data.
 * @returns A promise that resolves to the AI's final text response and the transcription.
 */
export async function runVoiceChatPipeline(
  input: VoiceChatInput
): Promise<VoiceChatOutput> {
  return voiceChatPipelineFlow(input);
}
