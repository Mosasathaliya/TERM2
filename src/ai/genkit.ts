
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This file is now primarily for running the Genkit dev server,
// which can still be useful for monitoring and other potential plugins.
// The model interactions are handled directly via API calls in the server actions.
export const ai = genkit({
  plugins: [
     googleAI({
      // The API key is read from the GEMINI_API_KEY environment variable
    }),
  ],
});
