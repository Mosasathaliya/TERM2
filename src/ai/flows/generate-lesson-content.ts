'use server';
/**
 * @fileOverview This flow generates a detailed Arabic explanation for a specific English grammar topic.
 */
import { z } from 'zod';
import { runAi } from '@/lib/cloudflare-ai';

export type GenerateExplanationInput = z.infer<typeof GenerateExplanationInputSchema>;
const GenerateExplanationInputSchema = z.object({
  grammarTopic: z.string().describe('The specific English grammar topic to be explained.'),
  level: z.string().describe('The level of the student (e.g., Beginner, Intermediate).')
});

export type GenerateExplanationOutput = {
  arabicExplanation: string;
};

export async function generateArabicExplanation(input: GenerateExplanationInput): Promise<GenerateExplanationOutput> {
  const { grammarTopic, level } = input;

  const system = [
    'You are a world-class English grammar instructor and Arabic technical writer.',
    'Write in Modern Standard Arabic that is simple, elegant, and pedagogically effective.',
    'Your task: explain the requested English grammar topic fully in Arabic,',
    'then include 3–5 crisp English example sentences with short Arabic glosses (EN → short AR).',
    'Avoid transliteration; use Arabic only for the explanation and glosses.',
    'Keep structure: Overview → Key rules → Common mistakes → Tips → Examples (EN + AR glosses).',
  ].join('\n');

  const user = [
    `Topic: ${grammarTopic}`,
    `Learner level: ${level}`,
    'Constraints:',
    '- Write only the Arabic explanation text and the examples as specified.',
    '- Do not include any headings like "Here is" or meta commentary.',
  ].join('\n');

  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];

  const primaryModel = (process as any)?.env?.CLOUDFLARE_PRIMARY_TEXT_MODEL || '@cf/meta/llama-3-8b-instruct';
  const response = await runAi({ model: primaryModel, inputs: { messages } });
  const jsonResponse = await response.json();
  const explanation = jsonResponse.result.response as string;

  return { arabicExplanation: explanation };
}
