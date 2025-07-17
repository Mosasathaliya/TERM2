
'use server';

/**
 * @fileOverview A Genkit flow for generating a personalized AI agent response, including conversation history.
 *
 * - personalizeAgentResponse - A function that handles generating the response.
 * - PersonalizeAgentResponseInput - The input type for the personalizeAgentResponse function.
 * - PersonalizeAgentResponseOutput - The return type for the personalizeAgentResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

// Define the schema for a single message in the conversation history
const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type Message = z.infer<typeof MessageSchema>;

// Input schema for the response personalization flow
const PersonalizeAgentResponseInputSchema = z.object({
  contextualizedPersona: z.string().describe('The detailed system prompt defining the AI agent\'s persona.'),
  history: z.array(MessageSchema).describe('The conversation history between the user and the agent.'),
  prompt: z.string().describe("The user's latest prompt or question."),
});
export type PersonalizeAgentResponseInput = z.infer<typeof PersonalizeAgentResponseInputSchema>;

// Output schema for the response personalization flow
const PersonalizeAgentResponseOutputSchema = z.object({
  response: z.string().describe("The AI agent's personalized response."),
});
export type PersonalizeAgentResponseOutput = z.infer<typeof PersonalizeAgentResponseOutputSchema>;

// Define the main Genkit flow
const personalizeAgentResponseFlow = ai.defineFlow(
  {
    name: 'personalizeAgentResponseFlow',
    inputSchema: PersonalizeAgentResponseInputSchema,
    outputSchema: PersonalizeAgentResponseOutputSchema,
  },
  async ({ contextualizedPersona, history, prompt }) => {
    // Generate a response using the Gemini model
    const response = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      // Use the provided persona as the system instruction
      system: contextualizedPersona,
      // Provide the user's prompt
      prompt: prompt,
      // Include the conversation history for context
      history,
    });
    
    // Extract the text from the response
    const text = response.text;
    if (!text) {
      // Handle cases where the model might not return text (e.g., due to safety filters)
      return { response: "I'm sorry, I don't have a response for that. Could you try asking something else?" };
    }
    
    return { response: text };
  }
);

/**
 * An exported async function that wraps the Genkit flow.
 * This is the function that will be called from the application's frontend.
 * @param input - The persona, history, and user prompt.
 * @returns A promise that resolves to the AI's personalized response.
 */
export async function personalizeAgentResponse(
  input: PersonalizeAgentResponseInput
): Promise<PersonalizeAgentResponseOutput> {
  return personalizeAgentResponseFlow(input);
}
