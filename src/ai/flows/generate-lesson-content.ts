'use server';
/**
 * @fileOverview Generates lesson content for English grammar topics targeted at Arabic-speaking students.
 */

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


async function queryNVIDIA(data: any) {
    const API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
    const response = await fetch(API_URL, {
        headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_NVIDIA_API_KEY}`,
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("NVIDIA API error:", errorText);
        throw new Error(`NVIDIA API request failed: ${response.statusText}`);
    }
    const result = await response.json();
    return result.choices[0]?.message?.content || "";
}


export async function generateLessonContent(
  input: GenerateLessonContentInput
): Promise<GenerateLessonContentOutput> {
  const prompt = `Generate educational content for an English grammar lesson for Arabic-speaking students.
Lesson Title: "${input.lessonTitle}"
Topic: "${input.englishGrammarTopic}"
Level: "${input.lessonLevel}"
Contextual English Notes: "${input.englishAdditionalNotes}"
Contextual English Common Mistakes: "${input.englishCommonMistakes}"

Provide the output as a single JSON object with the following keys: "arabicExplanation", "examples" (an array of {english, arabic} objects), "additionalNotesInArabic", "commonMistakesInArabic".

Here is the JSON object:
`;

  try {
    const nvidiaResponse = await queryNVIDIA({
        model: "meta/llama-4-maverick-17b-128e-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
    });
    
    const jsonString = nvidiaResponse.match(/\{[\s\S]*\}/)?.[0];
    if (!jsonString) {
        throw new Error("Failed to find a JSON object in the AI response.");
    }
    const output = JSON.parse(jsonString);

    if (!output.examples || output.examples.length === 0) {
        output.examples = [{english: "Example placeholder.", arabic: "مثال مؤقت."}];
    }

    return GenerateLessonContentOutputSchema.parse(output);

  } catch (error) {
    console.error("Failed to generate or parse lesson content:", error);
    throw new Error("Failed to generate lesson content.");
  }
}
