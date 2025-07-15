
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
      // You can specify supported models if needed, but it's often not necessary
      // as Genkit can discover them. This single plugin instance
      // will handle all Google AI models, including text and image generation.
    }),
  ],
  // You can set a default model for convenience
  // model: 'googleai/gemini-2.0-flash', 
});
