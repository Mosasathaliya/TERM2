import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {configureGenkit} from '@genkit-ai/next';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});

configureGenkit({
  plugins: [googleAI()],
});
