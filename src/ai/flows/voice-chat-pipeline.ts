
'use server';

/**
 * @fileoverview Defines a consolidated pipeline for voice chat using Hugging Face models.
 * This flow handles speech-to-text, persona contextualization, and response generation.
 */

import { z } from 'zod';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const STT_MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/openai/whisper-large-v3";
const LLM_MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct";


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


// Helper to convert data URI to Blob
function dataUriToBlob(dataUri: string) {
    const byteString = atob(dataUri.split(',')[1]);
    const mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

async function transcribeAudio(dataUri: string): Promise<string> {
    const audioBlob = dataUriToBlob(dataUri);
    const response = await fetch(STT_MODEL_ENDPOINT, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${HUGGING_FACE_API_KEY}` },
        body: audioBlob,
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Hugging Face STT error:", errorText);
        throw new Error(`STT request failed: ${response.statusText}`);
    }
    const result = await response.json();
    return result.text || "";
}

async function generateResponse(systemPrompt: string, history: Message[], newUserText: string): Promise<string> {
    const historyString = history.map(msg => {
        return msg.role === 'user' ? `<|user|>\n${msg.content}<|end|>` : `<|assistant|>\n${msg.content}<|end|>`;
    }).join('\n');
    
    const prompt = `<|system|>\n${systemPrompt}<|end|>\n${historyString}\n<|user|>\n${newUserText}<|end|>\n<|assistant|>`;

    const response = await fetch(LLM_MODEL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            inputs: prompt,
            parameters: { max_new_tokens: 512, return_full_text: false },
        }),
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Hugging Face LLM error:", errorText);
        throw new Error(`LLM request failed: ${response.statusText}`);
    }
    const result = await response.json();
    return result[0]?.generated_text || "Sorry, I couldn't generate a response.";
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
