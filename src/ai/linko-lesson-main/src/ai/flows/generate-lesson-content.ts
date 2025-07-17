
'use server';
/**
 * @fileOverview Generates lesson content (Arabic explanation, English examples with Arabic translations,
 * Arabic additional notes, Arabic common mistakes) for English grammar topics targeted at Arabic-speaking students.
 *
 * - generateLessonContent - A function that generates the lesson content.
 * - GenerateLessonContentInput - The input type for the generateLessonContent function.
 * - GenerateLessonContentOutput - The return type for the generateLessonContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLessonContentInputSchema = z.object({
  lessonTitle: z.string().describe('The title of the lesson (e.g., "Present Simple Tense").'),
  englishGrammarTopic: z.string().describe('The specific English grammar topic to be explained (e.g., "Forming questions with Present Simple").'),
  lessonLevel: z.enum(["Beginner", "Intermediate", "Advanced"]).describe('The proficiency level of the target student (Beginner, Intermediate, or Advanced).'),
  englishAdditionalNotes: z.string().optional().describe('Optional existing English additional notes to provide context to the AI for generating Arabic notes.'),
  englishCommonMistakes: z.string().optional().describe('Optional existing English common mistakes to provide context to the AI for generating Arabic common mistakes.'),
});
export type GenerateLessonContentInput = z.infer<typeof GenerateLessonContentInputSchema>;

const GenerateLessonContentOutputSchema = z.object({
  arabicExplanation: z.string().describe('A clear and comprehensive explanation of the English grammar topic, written entirely in Arabic, suitable for the specified student level.'),
  examples: z.array(z.object({
    english: z.string().describe('An English example sentence demonstrating the grammar topic.'),
    arabic: z.string().describe('The Arabic translation of the English example sentence.'),
  })).describe('3-5 clear English example sentences illustrating the grammar topic, each with its Arabic translation.'),
  additionalNotesInArabic: z.string().optional().describe('Helpful additional notes related to the grammar topic, written entirely in Arabic, suitable for the student level. This should be a paragraph or two.'),
  commonMistakesInArabic: z.string().optional().describe('Common mistakes Arabic-speaking students make related to this grammar topic, explained entirely in Arabic with examples if appropriate. This should be a paragraph or two.'),
});
export type GenerateLessonContentOutput = z.infer<typeof GenerateLessonContentOutputSchema>;


const lessonPrompt = ai.definePrompt({
  name: 'generateLessonContentPrompt',
  input: {schema: GenerateLessonContentInputSchema},
  output: {schema: GenerateLessonContentOutputSchema},
  prompt: `You are an expert English language professor creating educational content for Arabic-speaking students.
Your task is to generate the content for a lesson titled "{{lessonTitle}}" focusing on the English grammar topic: "{{englishGrammarTopic}}".
The target students are at the "{{lessonLevel}}" proficiency level.

Please provide the following:
1.  **Arabic Explanation (arabicExplanation)**: A clear, detailed, and comprehensive explanation of "{{englishGrammarTopic}}". This explanation MUST be entirely in Arabic. It should be easy for a {{lessonLevel}} Arabic-speaking student to understand. Cover the main rules, usage contexts, and any important nuances.
2.  **Examples (examples)**: Provide 3 to 5 distinct English example sentences that clearly illustrate the "{{englishGrammarTopic}}". For each English example, also provide its accurate Arabic translation. Ensure each object in the array has 'english' and 'arabic' fields.
3.  **Additional Notes in Arabic (additionalNotesInArabic)**: Provide helpful additional notes or tips related to the "{{englishGrammarTopic}}". These notes MUST be entirely in Arabic and should be concise and easy for a {{lessonLevel}} student to understand.
{{#if englishAdditionalNotes}}
    When generating these Arabic additional notes, please also consider these points which were noted in English: "{{englishAdditionalNotes}}". Ensure your Arabic notes are comprehensive and cover these aspects if relevant, in addition to other important tips.
{{/if}}
4.  **Common Mistakes in Arabic (commonMistakesInArabic)**: Describe common mistakes that Arabic-speaking students often make when learning or using "{{englishGrammarTopic}}". This explanation MUST be entirely in Arabic. Include examples of mistakes and their corrections if possible.
{{#if englishCommonMistakes}}
    When generating these Arabic common mistakes, please also consider these points which were noted in English: "{{englishCommonMistakes}}". Ensure your Arabic explanation of common mistakes covers these aspects if relevant, in addition to other common errors.
{{/if}}

Structure your entire response according to the output schema.
Focus on accuracy and pedagogical effectiveness for an Arabic-speaking audience learning English.
Do not include any conversational text, introductions or conclusions outside of the requested schema fields.
The Arabic explanation, additional notes, and common mistakes should be suitable for direct inclusion in a lesson.
`,
});

const generateLessonContentFlow = ai.defineFlow(
  {
    name: 'generateLessonContentFlow',
    inputSchema: GenerateLessonContentInputSchema,
    outputSchema: GenerateLessonContentOutputSchema,
  },
  async (input) => {
    const {output} = await lessonPrompt(input);
    if (!output) {
      throw new Error('AI failed to generate lesson content.');
    }
    
    if (!output.examples || output.examples.length === 0) {
        output.examples = [{english: "Example placeholder.", arabic: "مثال مؤقت."}];
    }
    return output;
  }
);

export async function generateLessonContent(input: GenerateLessonContentInput): Promise<GenerateLessonContentOutput> {
  return generateLessonContentFlow(input);
}
