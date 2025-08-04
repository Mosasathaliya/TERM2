
'use server';

/**
 * @fileOverview An AI agent for generating a vocabulary quiz based on a list of words, using Hugging Face.
 */

import { z } from 'zod';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct";

const WordSchema = z.object({
  english: z.string(),
  arabic: z.string(),
  definition: z.string(),
  arabicDefinition: z.string(),
  example: z.string(),
  arabicExample: z.string(),
});

export const VocabularyQuizInputSchema = z.object({
  words: z.array(WordSchema).describe('The list of words the user has just studied.'),
});
export type VocabularyQuizInput = z.infer<typeof VocabularyQuizInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question, asking for a definition or a synonym.'),
  options: z.array(z.string()).length(4).describe('An array of 4 possible answers.'),
  correct_answer: z.string().describe('The correct English word from the options.'),
});

export const VocabularyQuizOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).length(5).describe('An array of exactly 5 quiz questions.'),
});
export type VocabularyQuizOutput = z.infer<typeof VocabularyQuizOutputSchema>;

async function queryHuggingFace(payload: object) {
    const response = await fetch(MODEL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Hugging Face API error:", errorText);
        throw new Error(`Hugging Face API request failed: ${response.statusText}`);
    }
    return response.json();
}


export async function generateVocabularyQuiz(input: VocabularyQuizInput): Promise<VocabularyQuizOutput> {
    if (!HUGGING_FACE_API_KEY) {
        throw new Error("Hugging Face API key is not configured.");
    }

    const prompt = `You are a quiz master. Based on the following list of vocabulary words, create a quiz with exactly 5 multiple-choice questions.

Each question should test the user's knowledge of one of the words. The question should be a definition or a synonym phrase.
The options should be four English words, one of which is the correct answer. The correct answer must be one of the words from the provided list. The other three options should be plausible but incorrect distractors.

Word List:
${input.words.map(w => `- ${w.english}: ${w.definition}`).join('\n')}

You MUST respond with only a valid JSON object containing a 'questions' array, with no other text before or after it. The format must be:
{
  "questions": [
    {
      "question": "A question about a word.",
      "options": ["word1", "word2", "correct_answer_word", "word4"],
      "correct_answer": "correct_answer_word"
    },
    ...
  ]
}
`;

    const huggingFacePayload = {
        inputs: `<|system|>\nYou are an API that returns JSON.<|end|>\n<|user|>\n${prompt}<|end|>\n<|assistant|>`,
        parameters: {
            max_new_tokens: 1024,
            return_full_text: false,
        },
    };

    try {
        const result = await queryHuggingFace(huggingFacePayload);
        const responseText = result[0]?.generated_text;

        if (!responseText) {
            throw new Error("AI did not return any text.");
        }

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("AI response did not contain a valid JSON object.");
        }

        const parsedJson = JSON.parse(jsonMatch[0]);
        return VocabularyQuizOutputSchema.parse(parsedJson);

    } catch (error) {
        console.error("Generate vocabulary quiz error:", error);
        throw new Error("Failed to generate vocabulary quiz.");
    }
}
