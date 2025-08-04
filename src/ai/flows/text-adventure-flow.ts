'use server';
/**
 * @fileOverview Flows for the text adventure game.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const getSystemInstruction = (genre: string, historyLength: number) => `You are a world-class interactive fiction author and game master. 
Your task is to create a dynamic, branching text adventure in the ${genre} genre.
1.  **Narrative:** Write compelling, descriptive prose that establishes atmosphere and clearly communicates events. Your narrative should be one to two paragraphs long.
2.  **Vocabulary Creator:** Occasionally, you MUST invent a new, interesting, and plausible-sounding word relevant to the ${genre} context. This word should be naturally woven into the narrative. When you invent a word, you must include it in the 'newWord' field of your JSON response. Only invent one word per turn, and only if the story history has more than ${historyLength > 0 ? historyLength + 2 : 2} entries to avoid repetition.
3.  **Player Choice:** Always provide three distinct and interesting suggested actions for the player.
4.  **Game State:** The story must be coherent and react logically to the player's choices. Keep track of the story's progression based on the history.
5.  **Game Over:** If the player's action leads to a definitive end (e.g., player death, quest completion), set 'gameOver' to true.
Your output must be a single JSON object with the keys specified in the output schema.`;

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

const textAdventureFlow = ai.defineFlow(
  {
    name: 'textAdventureFlow',
    inputSchema: TextAdventureInputSchema,
    outputSchema: GameResponseSchema,
  },
  async ({ action, genre, playerInput, history }) => {
    const systemInstruction = getSystemInstruction(genre, history?.length || 0);

    const historyMessages = (history || []).flatMap(h => [
        { role: 'model' as const, content: [{ text: JSON.stringify({narrative: h.narrative, newWord: h.newWord, promptSuggestions: h.promptSuggestions, gameOver: h.gameOver}) }] },
        { role: 'user' as const, content: [{ text: h.promptSuggestions?.[0] || 'Continue' }] }
    ]);

    const { output } = await ai.generate({
        model: 'gemini-1.5-flash',
        system: systemInstruction,
        history: historyMessages,
        prompt: action === 'start' ? "Start the adventure." : playerInput || "Continue the story.",
        output: {
            schema: GameResponseSchema,
        },
    });
    return output!;
  }
);
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

const defineWordFlow = ai.defineFlow(
    {
        name: 'defineWordFlow',
        inputSchema: DefineWordInputSchema,
        outputSchema: DefineWordOutputSchema,
    },
    async ({ word, genre }) => {
        const { output } = await ai.generate({
            model: 'gemini-1.5-flash',
            prompt: `You are a creative linguist. For the fictional ${genre} word "${word}", provide a JSON object with:
1.  A concise, dictionary-style definition in English.
2.  A plausible Arabic translation for the word itself.
3.  A direct Arabic translation of the English definition.`,
            output: {
                schema: DefineWordOutputSchema,
            },
        });
        return output!;
    }
);
export { defineWordFlow as defineWord };


const GenerateImageInputSchema = z.object({
  word: z.string(),
  definition: z.string(),
  genre: z.string(),
});
const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe("The generated image as a data URI."),
});

const generateImageForWordFlow = ai.defineFlow(
    {
        name: 'generateImageForWordFlow',
        inputSchema: GenerateImageInputSchema,
        outputSchema: GenerateImageOutputSchema,
    },
    async ({ word, definition, genre }) => {
        const { media } = await ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: `A vivid, atmospheric, digital painting of "${word}", a concept from a ${genre} world which means: "${definition}". Focus on creating an iconic, visually striking image. Avoid text and borders.`,
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        });
        return { imageUrl: media!.url };
    }
);
export { generateImageForWordFlow as generateImageForWord };
