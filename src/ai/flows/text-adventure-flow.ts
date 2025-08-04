
'use server';
/**
 * @fileOverview Flows for the text adventure game, using Hugging Face.
 */
import { z } from 'zod';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const TEXT_MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct";
const IMAGE_MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo";

// Helper for querying the text model
async function queryTextModel(payload: object) {
    const response = await fetch(TEXT_MODEL_ENDPOINT, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Hugging Face API request failed: ${response.statusText}`);
    return response.json();
}

// Helper for querying the image model
async function queryImageModel(prompt: string): Promise<Blob> {
    const response = await fetch(IMAGE_MODEL_ENDPOINT, {
        headers: { Authorization: `Bearer ${HUGGING_FACE_API_KEY}` },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
    });
    if (!response.ok) throw new Error(`Hugging Face API request failed: ${response.statusText}`);
    return response.blob();
}


// Schemas and flow for the main text adventure
const getSystemInstruction = (genre: string, historyLength: number) => `You are a world-class interactive fiction author and game master. 
Your task is to create a dynamic, branching text adventure in the ${genre} genre.
1.  **Narrative:** Write compelling, descriptive prose that establishes atmosphere and clearly communicates events. Your narrative should be one to two paragraphs long.
2.  **Vocabulary Creator:** Occasionally, you MUST invent a new, interesting, and plausible-sounding word relevant to the ${genre} context. This word should be naturally woven into the narrative. When you invent a word, you must include it in the 'newWord' field of your JSON response. Only invent one word per turn, and only if the story history has more than ${historyLength > 0 ? historyLength + 2 : 2} entries to avoid repetition.
3.  **Player Choice:** Always provide three distinct and interesting suggested actions for the player.
4.  **Game State:** The story must be coherent and react logically to the player's choices. Keep track of the story's progression based on the history.
5.  **Game Over:** If the player's action leads to a definitive end (e.g., player death, quest completion), set 'gameOver' to true.
6.  **Format:** You MUST respond in valid JSON format, adhering to the provided schema. Do not include any markdown formatting like \`\`\`json.
    {
      "narrative": "...",
      "newWord": "...",
      "promptSuggestions": ["...", "...", "..."],
      "gameOver": false
    }
`;

const GameResponseSchema = z.object({
    narrative: z.string().describe("The main story text describing the current scene, events, and outcomes. Should be engaging and descriptive."),
    newWord: z.string().optional().describe("A single, unique, and plausible-sounding new word relevant to the story's genre. Should be naturally integrated into the narrative."),
    promptSuggestions: z.array(z.string()).describe("An array of 3 diverse and interesting actions the player could take next."),
    gameOver: z.boolean().describe("Set to true only if the story has reached a definitive end."),
});

const TextAdventureInputSchema = z.object({
    action: z.enum(['start', 'continue']),
    genre: z.string(),
    playerInput: z.string().optional(),
    history: z.array(GameResponseSchema).optional(),
});

function formatGamePrompt(input: z.infer<typeof TextAdventureInputSchema>) {
    const systemPrompt = getSystemInstruction(input.genre, input.history?.length || 0);
    const historyString = (input.history || []).map(h => `<|assistant|>\n${JSON.stringify(h)}<|end|>`).join('\n');
    const userPrompt = input.action === 'start' ? "Start the adventure." : input.playerInput || "Continue the story.";
    
    return `<|system|>\n${systemPrompt}<|end|>\n${historyString}\n<|user|>\n${userPrompt}<|end|>\n<|assistant|>`;
}

export async function textAdventureFlow(input: z.infer<typeof TextAdventureInputSchema>) {
    const payload = {
        inputs: formatGamePrompt(input),
        parameters: { max_new_tokens: 1024, return_full_text: false },
    };
    const result = await queryTextModel(payload);
    const jsonMatch = result[0]?.generated_text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI response did not contain a valid JSON object.");
    return GameResponseSchema.parse(JSON.parse(jsonMatch[0]));
}

// Schemas and flow for word definition
const DefineWordInputSchema = z.object({
  word: z.string(),
  genre: z.string(),
});
const DefineWordOutputSchema = z.object({
  definition: z.string().describe("The English definition."),
  arabicWord: z.string().describe("The Arabic translation of the word."),
  arabicDefinition: z.string().describe("The Arabic translation of the definition."),
});

export async function defineWord({ word, genre }: z.infer<typeof DefineWordInputSchema>) {
    const prompt = `You are a creative linguist. For the fictional ${genre} word "${word}", provide the following:
1.  A concise, dictionary-style definition in English.
2.  A plausible Arabic translation for the word itself.
3.  A direct Arabic translation of the English definition.
You must respond in a valid JSON format:
{
  "definition": "...",
  "arabicWord": "...",
  "arabicDefinition": "..."
}`;
    const payload = {
        inputs: `<|system|>\nYou are an API that returns JSON.<|end|>\n<|user|>\n${prompt}<|end|>\n<|assistant|>`,
        parameters: { max_new_tokens: 256, return_full_text: false },
    };
    const result = await queryTextModel(payload);
    const jsonMatch = result[0]?.generated_text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI response did not contain valid JSON.");
    return DefineWordOutputSchema.parse(JSON.parse(jsonMatch[0]));
}

// Schemas and flow for image generation
const GenerateImageInputSchema = z.object({
  word: z.string(),
  definition: z.string(),
  genre: z.string(),
});
const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe("The generated image as a data URI."),
});

export async function generateImageForWord({ word, definition, genre }: z.infer<typeof GenerateImageInputSchema>) {
    const prompt = `A vivid, atmospheric, digital painting of "${word}", a concept from a ${genre} world which means: "${definition}". Focus on creating an iconic, visually striking image. Avoid text and borders.`;
    const imageBlob = await queryImageModel(prompt);
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const imageUrl = `data:${imageBlob.type};base64,${base64}`;
    return { imageUrl };
}
