
'use server';
/**
 * @fileOverview Genkit flows for the text adventure game.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Helper function to get the base prompt for the game master AI.
const getSystemInstruction = (genre: string) => `You are a world-class interactive fiction author and game master. 
Your task is to create a dynamic, branching text adventure in the ${genre} genre.
1.  **Narrative:** Write compelling, descriptive prose that establishes atmosphere and clearly communicates events. Your narrative should be one to two paragraphs long.
2.  **Vocabulary Creator:** Occasionally, you MUST invent a new, interesting, and plausible-sounding word relevant to the ${genre} context. This word should be naturally woven into the narrative. When you invent a word, you must include it in the 'newWord' field of your JSON response. Only invent one word per turn, and not on every turn.
3.  **Player Choice:** Always provide three distinct and interesting suggested actions for the player.
4.  **Game State:** The story must be coherent and react logically to the player's choices. Keep track of the story's progression based on the history.
5.  **Game Over:** If the player's action leads to a definitive end (e.g., player death, quest completion), set 'gameOver' to true.
6.  **Format:** You MUST respond in valid JSON format, adhering to the provided schema. Do not include any markdown formatting like \`\`\`json.`;

// Schemas for the main text adventure flow
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
    name: 'textAdventureFlow',
    inputSchema: TextAdventureInputSchema,
    outputSchema: GameResponseSchema,
  },
  async ({ action, genre, playerInput, history }) => {
    const prompt = action === 'start' ? "Start the adventure." : playerInput || "Continue the story.";
    
    const { output } = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        system: getSystemInstruction(genre),
        prompt,
        history: history?.map(h => ({ role: 'model', content: [ { json: h } ]})),
        output: {
            format: 'json',
            schema: GameResponseSchema,
        },
    });

    return output!;
  }
);


// Schemas for the word definition flow
const DefineWordInputSchema = z.object({
  word: z.string(),
  genre: z.string(),
});
const DefineWordOutputSchema = z.object({
  definition: z.string(),
});

export const defineWord = ai.defineFlow(
  {
    name: 'defineWordFlow',
    inputSchema: DefineWordInputSchema,
    outputSchema: DefineWordOutputSchema,
  },
  async ({ word, genre }) => {
    const prompt = `Provide a concise, dictionary-style definition for the fictional ${genre} word: "${word}". The definition should be creative and fit the established tone. Do not repeat the word in the definition itself.`;
    const response = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt,
    });
    return { definition: response.text.trim() };
  }
);

// Schemas for the image generation flow
const GenerateImageInputSchema = z.object({
  word: z.string(),
  definition: z.string(),
  genre: z.string(),
});

const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe("The generated image as a data URI."),
});

export const generateImageForWord = ai.defineFlow(
  {
    name: 'generateImageForWordFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async ({ word, definition, genre }) => {
    const prompt = `A vivid, atmospheric, digital painting of "${word}", a concept from a ${genre} world which means: "${definition}". Focus on creating an iconic, visually striking image. Avoid text and borders.`;
    
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        aspectRatio: '1:1',
      },
    });
    
    if (!media) {
      throw new Error("Image generation failed.");
    }
    
    return { imageUrl: media.url };
  }
);
