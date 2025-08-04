
import {genkit} from 'genkit';

// This file is now primarily for running the Genkit dev server,
// which can still be useful for monitoring and other potential plugins.
// The model interactions are handled directly via API calls in the server actions.
export const ai = genkit({
  plugins: [
     // No plugins configured here as we are using direct API calls.
  ],
});
