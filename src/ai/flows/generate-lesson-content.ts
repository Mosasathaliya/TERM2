
'use server';
/**
 * @fileOverview Generates lesson content for English grammar topics targeted at Arabic-speaking students.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export type GenerateLessonContentInput = z.infer<typeof GenerateLessonContentInputSchema>;
const GenerateLessonContentInputSchema = z.object({
  lessonTitle: z.string().describe('The title of the lesson (e.g., "Present Simple Tense").'),
  englishGrammarTopic: z.string().describe('The specific English grammar topic to be explained (e.g., "Forming questions with Present Simple").'),
  lessonLevel: z.enum(["Beginner", "Intermediate", "Advanced"]).describe('The proficiency level of the target student (Beginner, Intermediate, or Advanced).'),
  englishAdditionalNotes: z.string().optional().describe('Optional existing English additional notes to provide context to the AI for generating Arabic notes.'),
  englishCommonMistakes: z.string().optional().describe('Optional existing English common mistakes to provide context to the AI for generating Arabic common mistakes.'),
});

const ExampleSchema = z.object({
    english: z.string().describe('An English example sentence demonstrating the grammar topic.'),
    arabic: z.string().describe('The Arabic translation of the English example sentence.'),
    imagePrompt: z.string().optional(),
    imageUrl: z.string().optional(),
});

export type GenerateLessonContentOutput = z.infer<typeof GenerateLessonContentOutputSchema>;
const GenerateLessonContentOutputSchema = z.object({
  arabicExplanation: z.string().describe('A clear and comprehensive explanation of the English grammar topic, written entirely in Arabic, suitable for the specified student level.'),
  examples: z.array(ExampleSchema).describe('3-5 clear English example sentences illustrating the grammar topic, each with its Arabic translation.'),
  additionalNotesInArabic: z.string().optional().describe('Helpful additional notes related to the grammar topic, written entirely in Arabic, suitable for the student level. This should be a paragraph or two.'),
  commonMistakesInArabic: z.string().optional().describe('Common mistakes Arabic-speaking students make related to this grammar topic, explained entirely in Arabic with examples if appropriate. This should be a paragraph or two.'),
});


export const generateLessonContent = ai.defineFlow(
  {
    name: 'generateLessonContent',
    inputSchema: GenerateLessonContentInputSchema,
    outputSchema: GenerateLessonContentOutputSchema,
  },
  async (input) => {
    let prompt = `You are an expert English language professor creating educational content for Arabic-speaking students.
Your task is to generate the content for a lesson titled "${input.lessonTitle}" focusing on the English grammar topic: "${input.englishGrammarTopic}".
The target students are at the "${input.lessonLevel}" proficiency level.

Please provide the following:
1.  **Arabic Explanation (arabicExplanation)**: A clear, detailed, and comprehensive explanation of "${input.englishGrammarTopic}". This explanation MUST be entirely in Arabic. It should be easy for a ${input.lessonLevel} Arabic-speaking student to understand. Cover the main rules, usage contexts, and any important nuances.
2.  **Examples (examples)**: Provide 3 to 5 distinct English example sentences that clearly illustrate the "${input.englishGrammarTopic}". For each English example, also provide its accurate Arabic translation. Ensure each object in the array has 'english' and 'arabic' fields.
3.  **Additional Notes in Arabic (additionalNotesInArabic)**: Provide helpful additional notes or tips related to the "${input.englishGrammarTopic}". These notes MUST be entirely in Arabic and should be concise and easy for a ${input.lessonLevel} student to understand.
${input.englishAdditionalNotes ? `When generating these Arabic additional notes, please also consider these points which were noted in English: "${input.englishAdditionalNotes}". Ensure your Arabic notes are comprehensive and cover these aspects if relevant, in addition to other important tips.` : ''}
4.  **Common Mistakes in Arabic (commonMistakesInArabic)**: Describe common mistakes that Arabic-speaking students often make when learning or using "${input.englishGrammarTopic}". This explanation MUST be entirely in Arabic. Include examples of mistakes and their corrections if possible.
${input.englishCommonMistakes ? `When generating these Arabic common mistakes, please also consider these points which were noted in English: "${input.englishCommonMistakes}". Ensure your Arabic explanation of common mistakes covers these aspects if relevant, in addition to other common errors.` : ''}
`;

    const { output } = await ai.generate({
      model: 'gemini-1.5-flash',
      output: { schema: GenerateLessonContentOutputSchema },
      prompt,
    });
    
    if (!output.examples || output.examples.length === 0) {
        output.examples = [{english: "Example placeholder.", arabic: "مثال مؤقت."}];
    }
    
    return output;
  }
);
