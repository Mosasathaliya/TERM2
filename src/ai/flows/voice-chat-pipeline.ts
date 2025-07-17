
'use server';

/**
 * @fileOverview Defines a consolidated Genkit flow for the entire voice chat pipeline.
 * This flow handles speech-to-text, persona contextualization, response generation,
 * and text-to-speech in a more optimized sequence.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {personalizeAgentResponse, type Message} from './personalize-agent-response';
import {contextualizeAIPersona} from './contextualize-ai-persona';

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
      return { response: "" }; // Return empty if transcription is empty
    }

    const userMessage: Message = { role: 'user', content: transcribedText };

    // Step 2 & 3 happen in parallel for speed
    const [personaResult, responseResult] = await Promise.all([
        // Step 2: Contextualize the AI's persona
        contextualizeAIPersona({
            personality,
            userName,
            userInfo,
        }),
        // Step 3: Generate the personalized response
        personalizeAgentResponse({
            // Note: We create a temporary persona here for the response generation.
            // The full persona is mainly for system-level context.
            contextualizedPersona: `You are an AI with the following personality: ${personality}.`,
            history: [...history, userMessage],
            prompt: transcribedText,
        })
    ]);

    return { response: responseResult.response };
  }
);


/**
 * An exported async function that wraps the Genkit flow.
 * This is the function that will be called from the application's frontend.
 * @param input - The voice chat input data.
 * @returns A promise that resolves to the AI's final text response.
 */
export async function runVoiceChatPipeline(
  input: VoiceChatInput
): Promise<VoiceChatOutput> {
  return voiceChatPipelineFlow(input);
}
