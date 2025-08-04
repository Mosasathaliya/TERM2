'use server';

/**
 * @fileOverview An AI agent for generating a vocabulary quiz based on a list of words.
 */

import { z } from 'zod';

const WordSchema = z.object({
  english: z.string(),
  arabic: z.string(),
  definition: z.string(),
  arabicDefinition: z.string(),
  example: z.string(),
  arabicExample: z.string(),
});

const VocabularyQuizInputSchema = z.object({
  words: z.array(WordSchema).describe('The list of words the user has just studied.'),
});
export type VocabularyQuizInput = z.infer<typeof VocabularyQuizInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question, asking for a definition or a synonym.'),
  options: z.array(z.string()).length(4).describe('An array of 4 possible answers.'),
  correct_answer: z.string().describe('The correct English word from the options.'),
});

const VocabularyQuizOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).length(5).describe('An array of exactly 5 quiz questions.'),
});
export type VocabularyQuizOutput = z.infer<typeof VocabularyQuizOutputSchema>;

async function queryHuggingFace(data: any) {
    const API_URL = "https://api-inference.huggingface.co/models/gpt2";
    const response = await fetch(API_URL, {
        headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}`,
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Hugging Face API error:", errorText);
        throw new Error(`Hugging Face API request failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result[0]?.generated_text || "";
}


export async function generateVocabularyQuiz({ words }: VocabularyQuizInput): Promise<VocabularyQuizOutput> {
    const prompt = `You are a quiz master. Based on the following list of vocabulary words, create a quiz with exactly 5 multiple-choice questions.

Each question should test the user's knowledge of one of the words. The question should be a definition or a synonym phrase.
The options should be four English words, one of which is the correct answer. The correct answer must be one of the words from the provided list. The other three options should be plausible but incorrect distractors.

Your output must be a single JSON object with a "questions" key, which holds an array of 5 question objects.

Word List:
${words.map(w => `- ${w.english}: ${w.definition}`).join('\n')}

Here is the JSON object:
`;

    const hfResponse = await queryHuggingFace({
      inputs: prompt,
      parameters: { max_new_tokens: 500, return_full_text: false }
    });

    try {
        const jsonString = hfResponse.match(/\{[\s\S]*\}/)?.[0];
        if (!jsonString) {
            throw new Error("Failed to extract JSON from Hugging Face response.");
        }
        const output = JSON.parse(jsonString);
        return VocabularyQuizOutputSchema.parse(output);
    } catch (error) {
        console.error("Failed to parse vocabulary quiz from Hugging Face response:", error);
        throw new Error("Could not generate a valid vocabulary quiz.");
    }
}
