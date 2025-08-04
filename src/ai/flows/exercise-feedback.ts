
'use server';

/**
 * @fileOverview Provides AI-powered feedback on user responses to interactive exercises,
 * referencing specific sections of the lesson material.
 * Now using Hugging Face.
 */

import { z } from 'zod';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct";

export type ExerciseFeedbackInput = z.infer<typeof ExerciseFeedbackInputSchema>;
const ExerciseFeedbackInputSchema = z.object({
  lessonTitle: z.string().describe('The title of the lesson.'),
  lessonTopic: z.string().describe('The topic of the lesson.'),
  lessonLevel: z.string().describe('The level of the lesson (e.g., Beginner, Intermediate, Advanced).'),
  lessonArabicExplanation: z.string().describe('The Arabic explanation of the lesson.'),
  lessonExamples: z.array(
    z.object({
      english: z.string().describe('The English example.'),
      arabic: z.string().describe('The Arabic translation of the example.'),
      imagePrompt: z.string().optional(),
      imageUrl: z.string().optional(),
    })
  ).describe('Examples provided in the lesson.'),
  lessonInteractiveExercises: z.array(
    z.object({
      type: z.string().describe('The type of the exercise (e.g., multiple_choice).'),
      question: z.string().describe('The question of the exercise.'),
      choices: z.array(z.string()).optional().describe('The choices for the multiple-choice question.'),
      correct_answer: z.string().describe('The correct answer to the exercise.'),
      user_answer: z.string().describe('The user provided answer to the exercise.'),
    })
  ).describe('Interactive exercises in the lesson.'),
  lessonAdditionalNotes: z.string().optional().describe('Additional notes for the lesson.'),
  lessonCommonMistakes: z.string().optional().describe('Common mistakes students make in the lesson.'),
  lessonAdditionalNotesArabic: z.string().optional().describe('Additional notes for the lesson in Arabic.'),
  lessonCommonMistakesArabic: z.string().optional().describe('Common mistakes students make in the lesson in Arabic.'),
});

export type ExerciseFeedbackOutput = z.infer<typeof ExerciseFeedbackOutputSchema>;
const ExerciseFeedbackOutputSchema = z.object({
  feedback: z.string().describe('AI-powered feedback on the user\'s answer, referencing specific sections of the lesson material. This feedback should be primarily in Arabic.'),
});

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

function formatPrompt(input: ExerciseFeedbackInput) {
    const exercise = input.lessonInteractiveExercises[0];
    let prompt = `You are an AI-powered tutor providing feedback to students on their answers to language learning exercises.
Your primary language for feedback MUST be ARABIC. You can use English for specific grammar terms if necessary, but explanations and clarifications should be in Arabic.

The student is currently working on a lesson titled "${input.lessonTitle}" on the topic of "${input.lessonTopic}" at the "${input.lessonLevel}" level.
Here is the Arabic explanation of the lesson: "${input.lessonArabicExplanation}".
Here are some examples from the lesson:
${input.lessonExamples.map(ex => `- English: "${ex.english}", Arabic: "${ex.arabic}"`).join('\n')}
${input.lessonAdditionalNotesArabic ? `Here are additional notes in Arabic: "${input.lessonAdditionalNotesArabic}"` : ''}
${input.lessonCommonMistakesArabic ? `Here are common mistakes in Arabic: "${input.lessonCommonMistakesArabic}"` : ''}

Now, consider the following interactive exercise and the student's answer:
Question: "${exercise.question}"
Correct Answer: "${exercise.correct_answer}"
Student's Answer: "${exercise.user_answer}"

Provide targeted feedback to the student IN ARABIC.
If the student's answer is correct, congratulate them in Arabic and perhaps offer a small additional tip or encouragement in Arabic.
If the student's answer is incorrect, explain IN ARABIC why it's incorrect, clarify the correct answer IN ARABIC, and reference specific sections of the lesson material (like the Arabic explanation or examples) to reinforce understanding. Be encouraging and helpful.
Ensure your entire feedback is in Arabic. Your response should be ONLY the feedback text.`;
    
    return `<|system|>\n${prompt}<|end|>\n<|user|>\nMy answer was "${exercise.user_answer}". Give me feedback.<|end|>\n<|assistant|>`;
}


export async function getExerciseFeedback(input: ExerciseFeedbackInput): Promise<ExerciseFeedbackOutput> {
    if (!HUGGING_FACE_API_KEY) {
        throw new Error("Hugging Face API key is not configured.");
    }
    
    const huggingFacePayload = {
        inputs: formatPrompt(input),
        parameters: {
            max_new_tokens: 512,
            return_full_text: false,
        },
    };

    try {
        const result = await queryHuggingFace(huggingFacePayload);
        const feedback = result[0]?.generated_text || "عذراً، لم أتمكن من إنشاء رد.";
        return { feedback };
    } catch (error) {
        console.error("Exercise Feedback error:", error);
        return { feedback: "عذراً، حدث خطأ أثناء معالجة طلبك." };
    }
}
