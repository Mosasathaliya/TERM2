
'use server';

/**
 * @fileOverview Defines a Genkit flow that generates a detailed, contextualized persona for an AI agent.
 * This flow takes a simple personality description and expands it into a comprehensive system prompt.
 *
 * - contextualizeAIPersona - A function that handles the persona generation process.
 * - ContextualizeAIPersonaInput - The input type for the contextualizeAIPersona function.
 * - ContextualizeAIPersonaOutput - The return type for the contextualizeAIPersona function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

// Input schema for the persona contextualization flow
const ContextualizeAIPersonaInputSchema = z.object({
  personality: z
    .string()
    .describe('A brief, high-level description of the desired AI personality (e.g., "A witty pirate captain").'),
  userName: z.string().optional().describe("The user's name, if available."),
  userInfo: z.string().optional().describe("Additional information about the user, if available."),
});
export type ContextualizeAIPersonaInput = z.infer<typeof ContextualizeAIPersonaInputSchema>;

// Output schema for the persona contextualization flow
const ContextualizeAIPersonaOutputSchema = z.object({
  contextualizedPersona: z
    .string()
    .describe(
      'A detailed, first-person system prompt that the AI will use to guide its responses, incorporating the base personality and any user details.'
    ),
});
export type ContextualizeAIPersonaOutput = z.infer<typeof ContextualizeAIPersonaOutputSchema>;

// Define the Genkit prompt for generating the persona
const personaPrompt = ai.definePrompt({
  name: 'personaPrompt',
  model: 'googleai/gemini-2.5-flash',
  input: { schema: ContextualizeAIPersonaInputSchema },
  output: { schema: ContextualizeAIPersonaOutputSchema },

  // The prompt instructs the AI to act as a character creator.
  // It uses Handlebars templates `{{ }}` to insert the input variables.
  prompt: `You are an expert character creator for an AI assistant. Your task is to generate a detailed, first-person system prompt for another AI.

Create a persona based on the following description: {{{personality}}}.

The persona should be rich and engaging. It should define how the AI speaks, its quirks, and its attitude.

{{#if userName}}
The user's name is {{userName}}. Incorporate this into the persona, allowing the AI to address the user by name.
{{/if}}

{{#if userInfo}}
Here is some information about the user: "{{userInfo}}". Use this to further tailor the AI's persona and make it more relevant to the user.
{{/if}}

The final output should be a single, ready-to-use system prompt written from the AI's perspective. Do not include any explanatory text outside of the persona itself.`,
});

// Define the main Genkit flow
const contextualizeAIPersonaFlow = ai.defineFlow(
  {
    name: 'contextualizeAIPersonaFlow',
    inputSchema: ContextualizeAIPersonaInputSchema,
    outputSchema: ContextualizeAIPersonaOutputSchema,
  },
  async (input) => {
    // Execute the prompt with the given input
    const { output } = await personaPrompt(input);

    // The output will be a JSON object conforming to ContextualizeAIPersonaOutputSchema.
    // The `!` asserts that the output is not null.
    return output!;
  }
);

/**
 * An exported async function that wraps the Genkit flow.
 * This is the function that will be called from the application's frontend.
 * @param input - The personality and user details.
 * @returns A promise that resolves to the detailed, contextualized AI persona.
 */
export async function contextualizeAIPersona(
  input: ContextualizeAIPersonaInput
): Promise<ContextualizeAIPersonaOutput> {
  return contextualizeAIPersonaFlow(input);
}
