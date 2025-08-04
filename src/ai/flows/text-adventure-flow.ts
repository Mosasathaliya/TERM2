
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

export const textAdventureFlow = ai.defineFlow(
  {
    name: 'textAdventure',
    inputSchema: TextAdventureInputSchema,
    outputSchema: GameResponseSchema,
  },
  async ({ action, genre, playerInput, history }) => {
    const systemPrompt = getSystemInstruction(genre, history?.length || 0);
    const userPrompt = action === 'start' ? "Start the adventure." : playerInput || "Continue the story.";
    
    const historyMessages = (history || []).flatMap(h => [
        { role: 'model', content: JSON.stringify(h) } as const,
        { role: 'user', content: h.promptSuggestions?.[0] || "Continue" } as const // A plausible user response
    ]).slice(0, -1); // Remove the last user message as it's replaced by the new prompt

    const { output } = await ai.generate({
      model: 'gemini-1.5-flash',
      output: { schema: GameResponseSchema },
      history: [
        ...historyMessages,
        { role: 'user', content: userPrompt }
      ],
      system: systemPrompt,
    });
    return output!;
  }
);

const DefineWordInputSchema = z.object({
  word: z.string(),
  genre: z.string(),
});
const DefineWordOutputSchema = z.object({
  definition: z.string().describe("The English definition."),
  arabicWord: z.string().describe("The Arabic translation of the word."),
  arabicDefinition: z.string().describe("The Arabic translation of the definition."),
});

export const defineWord = ai.defineFlow(
    {
        name: 'defineWord',
        inputSchema: DefineWordInputSchema,
        outputSchema: DefineWordOutputSchema
    },
    async ({ word, genre }) => {
        const { output } = await ai.generate({
            model: 'gemini-1.5-flash',
            output: { schema: DefineWordOutputSchema },
            prompt: `You are a creative linguist. For the fictional ${genre} word "${word}", provide the following:
1.  A concise, dictionary-style definition in English.
2.  A plausible Arabic translation for the word itself.
3.  A direct Arabic translation of the English definition.`
        });
        return output!;
    }
);


const GenerateImageInputSchema = z.object({
  word: z.string(),
  definition: z.string(),
  genre: z.string(),
});
const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe("The generated image as a data URI."),
});

export async function generateImageForWord({ word, definition, genre }: z.infer<typeof GenerateImageInputSchema>): Promise<z.infer<typeof GenerateImageOutputSchema>> {
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `A vivid, atmospheric, digital painting of "${word}", a concept from a ${genre} world which means: "${definition}". Focus on creating an iconic, visually striking image. Avoid text and borders.`,
        config: {
            responseModalities: ['IMAGE', 'TEXT'],
        },
    });
    return { imageUrl: media.url };
}
