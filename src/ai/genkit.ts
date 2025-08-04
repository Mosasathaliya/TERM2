
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      // The API key is read from the GEMINI_API_KEY environment variable
    }),
  ],
  // You can set a default model for convenience
  // model: 'googleai/gemini-1.5-flash',
});
