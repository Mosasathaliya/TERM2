import { GoogleGenAI, Type, type Chat } from "@google/genai";
import type { GameResponse, GameGenre } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const textModel = 'gemini-2.5-flash';
const imageModel = 'imagen-3.0-generate-002';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        narrative: {
            type: Type.STRING,
            description: "The main story text describing the current scene, events, and outcomes. Should be engaging and descriptive."
        },
        newWord: {
            type: Type.STRING,
            description: "A single, unique, and plausible-sounding new word relevant to the story's genre. Should be naturally integrated into the narrative. Provide only the word itself."
        },
        promptSuggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of 3 diverse and interesting actions the player could take next."
        },
        gameOver: {
            type: Type.BOOLEAN,
            description: "Set to true only if the story has reached a definitive end (e.g., player death, quest completion). Otherwise, false."
        }
    },
    required: ["narrative", "promptSuggestions", "gameOver"]
};

const getSystemInstruction = (genre: GameGenre) => `You are a world-class interactive fiction author and game master. 
Your task is to create a dynamic, branching text adventure in the ${genre} genre.
1.  **Narrative:** Write compelling, descriptive prose that establishes atmosphere and clearly communicates events.
2.  **Vocabulary Creator:** Occasionally, you MUST invent a new, interesting, and plausible-sounding word relevant to the ${genre} context. This word should be naturally woven into the narrative. When you invent a word, you must include it in the 'newWord' field of your JSON response. Only invent one word per turn, and not on every turn.
3.  **Player Choice:** Always provide three distinct and interesting suggested actions for the player.
4.  **Game State:** The story must be coherent and react logically to the player's choices. Keep track of the story's progression.
5.  **Format:** You MUST respond in valid JSON format, adhering to the provided schema. Do not include any markdown formatting like \`\`\`json.`;


const parseJsonResponse = (text: string): GameResponse => {
    try {
        const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(cleanedText);
        
        // Basic validation
        if (typeof parsed.narrative !== 'string' || !Array.isArray(parsed.promptSuggestions) || typeof parsed.gameOver !== 'boolean') {
            throw new Error('Invalid JSON structure from AI');
        }
        
        return {
            narrative: parsed.narrative,
            newWord: parsed.newWord || undefined,
            promptSuggestions: parsed.promptSuggestions,
            gameOver: parsed.gameOver
        };
    } catch (error) {
        console.error("Failed to parse AI JSON response:", error);
        console.error("Raw response text:", text);
        // Fallback response
        return {
            narrative: "The fabric of reality shimmers and warps. The game master seems to have lost the thread of the story. Try a different action to restore order.",
            newWord: undefined,
            promptSuggestions: ["Look around", "Check my inventory", "Wait for something to happen"],
            gameOver: false,
        };
    }
};

export async function startGame(genre: GameGenre): Promise<{ chat: Chat; initialResponse: GameResponse; }> {
    const chat = ai.chats.create({
        model: textModel,
        config: {
            systemInstruction: getSystemInstruction(genre),
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const response = await chat.sendMessage({ message: "Start the adventure." });
    const initialResponse = parseJsonResponse(response.text);

    return { chat, initialResponse };
}

export async function continueStory(chat: Chat, action: string): Promise<GameResponse> {
    const response = await chat.sendMessage({ message: action });
    return parseJsonResponse(response.text);
}

export async function getWordDefinition(word: string, genre: GameGenre): Promise<string> {
    const prompt = `Provide a concise, dictionary-style definition for the fictional ${genre} word: "${word}". The definition should be creative and fit the established tone. Do not repeat the word in the definition itself.`;
    const response = await ai.models.generateContent({
        model: textModel,
        contents: prompt
    });
    return response.text.trim();
}

export async function generateWordImage(word: string, definition: string, genre: GameGenre): Promise<string> {
    const prompt = `A vivid, atmospheric, digital painting of "${word}", a concept from a ${genre} world which means: "${definition}". Focus on creating an iconic, visually striking image. Avoid text and borders.`;
    
    const response = await ai.models.generateImages({
        model: imageModel,
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1',
        },
    });
    
    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("Image generation failed.");
    }
    
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
}
