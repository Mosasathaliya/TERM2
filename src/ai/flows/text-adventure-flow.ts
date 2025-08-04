
'use server';
/**
 * @fileOverview Flows for the text adventure game using Cloudflare Workers AI.
 */
import { z } from 'zod';

const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN;
const MODEL_NAME = '@cf/mistral/mistral-7b-instruct-v0.1';

function isBalanced(str: string) {
    const stack = [];
    const map: Record<string, string> = {
        '(': ')',
        '[': ']',
        '{': '}'
    };
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (map[char]) {
            stack.push(char);
        } else if (Object.values(map).includes(char)) {
            if (map[stack.pop()!] !== char) {
                return false;
            }
        }
    }
    return stack.length === 0;
}

async function queryCloudflare(messages: { role: string; content: string }[], isJsonMode: boolean = false): Promise<any> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${MODEL_NAME}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages, raw: isJsonMode }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Cloudflare AI API error:", errorText);
        throw new Error(`Cloudflare AI API request failed: ${response.statusText}`);
    }
    
    const jsonResponse = await response.json();

    if (isJsonMode) {
      try {
        const responseText = jsonResponse.result.response;
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
            const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
             if (isBalanced(jsonString)) {
                return JSON.parse(jsonString);
             }
        }
        throw new Error("Incomplete or invalid JSON object found in response");
      } catch (e) {
        console.error("Failed to parse JSON from Cloudflare AI:", jsonResponse.result.response, e);
        throw new Error("Failed to parse JSON from AI response.");
      }
    }

    return jsonResponse.result.response;
}

const getSystemInstruction = (genre: string, historyLength: number) => `You are a world-class interactive fiction author and game master.
You will create a dynamic, branching text adventure in the ${genre} genre.
Your response MUST be a single, valid, and complete JSON object with no other text before or after it.
The JSON object must adhere to the following schema:
- "narrative": A string of 1-2 paragraphs describing the current scene, events, and outcomes. It should be engaging, descriptive, and well-written.
- "newWord": An optional unique, plausible-sounding word relevant to the genre. Only invent a new word if the story history has more than ${historyLength > 0 ? historyLength + 2 : 2} entries.
- "promptSuggestions": An array of exactly 3 diverse and interesting strings for player actions.
- "gameOver": A boolean value, set to true only if the story has reached a definitive narrative conclusion.`;

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

const textAdventureFlow = async ({ action, genre, playerInput, history }: z.infer<typeof TextAdventureInputSchema>) => {
    const systemInstruction = getSystemInstruction(genre, history?.length || 0);

    const historyMessages = (history || []).flatMap(h => [
        { role: 'assistant' as const, content: JSON.stringify({narrative: h.narrative, newWord: h.newWord, promptSuggestions: h.promptSuggestions, gameOver: h.gameOver}) },
        { role: 'user' as const, content: h.promptSuggestions?.[0] || 'Continue' }
    ]);
    
    const userPrompt = action === 'start' ? "Start the adventure." : playerInput || "Continue the story.";

    const messages = [
        { role: 'system', content: systemInstruction },
        ...historyMessages,
        { role: 'user', content: userPrompt }
    ];
    
    try {
        const output = await queryCloudflare(messages, true);
        return GameResponseSchema.parse(output);
    } catch(e) {
        console.error("Error in textAdventureFlow:", e);
        return {
            narrative: "The connection to the story world flickers and dies. An error has occurred. Please try starting a new adventure.",
            promptSuggestions: ["Restart"],
            gameOver: true
        };
    }
};
export { textAdventureFlow };

const DefineWordInputSchema = z.object({
  word: z.string(),
  genre: z.string(),
});
const DefineWordOutputSchema = z.object({
  definition: z.string().describe("The English definition."),
  arabicWord: z.string().describe("The Arabic translation of the word."),
  arabicDefinition: z.string().describe("The Arabic translation of the definition."),
});

const defineWordFlow = async ({ word, genre }: z.infer<typeof DefineWordInputSchema>) => {
    const prompt = `You are a creative linguist and an expert in both English and Arabic. For the fictional ${genre} word "${word}", provide a JSON object with:
1.  "definition": A concise, dictionary-style definition in English.
2.  "arabicWord": A plausible, natural-sounding Arabic translation for the word itself.
3.  "arabicDefinition": A direct and accurate Arabic translation of the English definition.
Your output must be ONLY the valid and complete JSON object.`;
    
    const messages = [{role: 'user', content: prompt}];

    try {
        const output = await queryCloudflare(messages, true);
        return DefineWordOutputSchema.parse(output);
    } catch (e) {
         console.error("Error in defineWordFlow:", e);
         return {
            definition: "Could not retrieve definition.",
            arabicWord: "فشل",
            arabicDefinition: "تعذر استرداد التعريف."
         };
    }
};
export { defineWordFlow as defineWord };


const GenerateImageInputSchema = z.object({
  word: z.string(),
  definition: z.string(),
  genre: z.string(),
});

const generateImageForWordFlow = async ({ word, definition, genre }: z.infer<typeof GenerateImageInputSchema>) => {
    const prompt = `A vivid, atmospheric, digital painting of "${word}", a concept from a ${genre} world which means: "${definition}". Focus on creating an iconic, visually striking image. Avoid text and borders.`;
    
    // NOTE: This flow requires an image generation model, but the user provided a text model.
    // We will call the text model and return a placeholder.
    console.warn("Image generation called, but text model is configured. Returning placeholder.");
    
    // To make this work, one would integrate an image generation API here.
    // For now, we return a placeholder from placehold.co to avoid errors.
    const placeholderUrl = `https://placehold.co/512x512/1E1E1E/FFFFFF.png?text=${encodeURIComponent(word)}`;
    return { imageUrl: placeholderUrl };
};
export { generateImageForWordFlow as generateImageForWord };
