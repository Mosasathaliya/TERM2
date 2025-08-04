'use server';
/**
 * @fileOverview Flows for the text adventure game.
 */
import { z } from 'zod';

const getSystemInstruction = (genre: string, historyLength: number) => `You are a world-class interactive fiction author and game master. 
Your task is to create a dynamic, branching text adventure in the ${genre} genre.
1.  **Narrative:** Write compelling, descriptive prose that establishes atmosphere and clearly communicates events. Your narrative should be one to two paragraphs long.
2.  **Vocabulary Creator:** Occasionally, you MUST invent a new, interesting, and plausible-sounding word relevant to the ${genre} context. This word should be naturally woven into the narrative. When you invent a word, you must include it in the 'newWord' field of your JSON response. Only invent one word per turn, and only if the story history has more than ${historyLength > 0 ? historyLength + 2 : 2} entries to avoid repetition.
3.  **Player Choice:** Always provide three distinct and interesting suggested actions for the player.
4.  **Game State:** The story must be coherent and react logically to the player's choices. Keep track of the story's progression based on the history.
5.  **Game Over:** If the player's action leads to a definitive end (e.g., player death, quest completion), set 'gameOver' to true.
Your output must be a single JSON object with keys: "narrative", "newWord", "promptSuggestions", "gameOver".
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
    return result[0]?.generated_text || "";
}

export async function textAdventureFlow({ action, genre, playerInput, history }: z.infer<typeof TextAdventureInputSchema>): Promise<z.infer<typeof GameResponseSchema>> {
    const systemPrompt = getSystemInstruction(genre, history?.length || 0);
    const userPrompt = action === 'start' ? "Start the adventure." : playerInput || "Continue the story.";
    
    const historyText = (history || []).map(h => `Story: ${h.narrative}\nPlayer action: ${h.promptSuggestions?.[0] || "Continue"}`).join('\n\n');
    
    const fullPrompt = `${systemPrompt}\n\n${historyText}\nPlayer action: ${userPrompt}\n\nHere is the JSON object:\n`;
    
    const hfResponse = await queryHuggingFace({
      inputs: fullPrompt,
      parameters: { max_new_tokens: 400, return_full_text: false }
    });

    try {
        const jsonString = hfResponse.match(/\{[\s\S]*\}/)?.[0];
        if (!jsonString) {
            throw new Error("Failed to extract JSON from Hugging Face response.");
        }
        const output = JSON.parse(jsonString);
        return GameResponseSchema.parse(output);
    } catch (error) {
        console.error("Failed to parse text adventure response from Hugging Face:", error);
        return {
            narrative: "An unexpected error occurred in the story. Please try starting a new game.",
            promptSuggestions: ["Start a new game"],
            gameOver: true
        };
    }
}

const DefineWordInputSchema = z.object({
  word: z.string(),
  genre: z.string(),
});
const DefineWordOutputSchema = z.object({
  definition: z.string().describe("The English definition."),
  arabicWord: z.string().describe("The Arabic translation of the word."),
  arabicDefinition: z.string().describe("The Arabic translation of the definition."),
});

export async function defineWord({ word, genre }: z.infer<typeof DefineWordInputSchema>): Promise<z.infer<typeof DefineWordOutputSchema>> {
    const prompt = `You are a creative linguist. For the fictional ${genre} word "${word}", provide a JSON object with:
1.  A concise, dictionary-style definition in English (key: "definition").
2.  A plausible Arabic translation for the word itself (key: "arabicWord").
3.  A direct Arabic translation of the English definition (key: "arabicDefinition").

Here is the JSON object:
`;
    const hfResponse = await queryHuggingFace({
      inputs: prompt,
      parameters: { max_new_tokens: 100, return_full_text: false }
    });

    try {
        const jsonString = hfResponse.match(/\{[\s\S]*\}/)?.[0];
        if (!jsonString) throw new Error("No JSON found in definition response");
        const output = JSON.parse(jsonString);
        return DefineWordOutputSchema.parse(output);
    } catch (error) {
        console.error("Failed to define word:", error);
        return {
            definition: "Definition not available.",
            arabicWord: "غير متوفر",
            arabicDefinition: "التعريف غير متوفر."
        };
    }
}


const GenerateImageInputSchema = z.object({
  word: z.string(),
  definition: z.string(),
  genre: z.string(),
});
const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe("The generated image as a data URI."),
});

async function queryImageHuggingFace(data: any): Promise<Blob> {
    const API_URL = "https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo";
    const response = await fetch(API_URL, {
        headers: { "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}` },
        method: "POST",
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Hugging Face API error:", errorText);
        throw new Error(`Hugging Face API request failed: ${response.statusText}`);
    }
    return response.blob();
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function generateImageForWord({ word, definition, genre }: z.infer<typeof GenerateImageInputSchema>): Promise<z.infer<typeof GenerateImageOutputSchema>> {
    const imageBlob = await queryImageHuggingFace({ 
      inputs: `A vivid, atmospheric, digital painting of "${word}", a concept from a ${genre} world which means: "${definition}". Focus on creating an iconic, visually striking image. Avoid text and borders.` 
    });
    const imageUrl = await blobToBase64(imageBlob);
    return { imageUrl };
}
