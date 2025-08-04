
import {genkit} from 'genkit';
// We are removing the googleAI plugin to use Hugging Face instead.
// The API calls will be handled directly in the flows.

export const ai = genkit({
  plugins: [
    // No default plugin needed when making direct API calls.
  ],
  // You can set a default model for convenience
  // model: 'huggingface/microsoft/phi-3-mini-instruct', 
});
