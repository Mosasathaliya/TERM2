
'use server';

/**
 * @fileOverview Provides AI-powered feedback on user responses to interactive exercises,
 * referencing specific sections of the lesson material.
 *
 * - getExerciseFeedback - A function that provides feedback on exercise answers.
 * - ExerciseFeedbackInput - The input type for the getExerciseFeedback function.
 * - ExerciseFeedbackOutput - The return type for the getExerciseFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

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
  // Adding Arabic notes and mistakes to provide fuller context to the AI if available
  lessonAdditionalNotesArabic: z.string().optional().describe('Additional notes for the lesson in Arabic.'),
  lessonCommonMistakesArabic: z.string().optional().describe('Common mistakes students make in the lesson in Arabic.'),
});

export type ExerciseFeedbackInput = z.infer<typeof ExerciseFeedbackInputSchema>;

const ExerciseFeedbackOutputSchema = z.object({
  feedback: z.string().describe('AI-powered feedback on the user\'s answer, referencing specific sections of the lesson material. This feedback should be primarily in Arabic.'),
});

export type ExerciseFeedbackOutput = z.infer<typeof ExerciseFeedbackOutputSchema>;

export async function getExerciseFeedback(input: ExerciseFeedbackInput): Promise<ExerciseFeedbackOutput> {
  return exerciseFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'exerciseFeedbackPrompt',
  input: {schema: ExerciseFeedbackInputSchema},
  output: {schema: ExerciseFeedbackOutputSchema},
  prompt: `You are an AI-powered tutor providing feedback to students on their answers to language learning exercises.
Your primary language for feedback MUST be ARABIC. You can use English for specific grammar terms if necessary, but explanations and clarifications should be in Arabic.

The student is currently working on a lesson titled "{{lessonTitle}}" on the topic of "{{lessonTopic}}" at the "{{lessonLevel}}" level.
Here is the Arabic explanation of the lesson: "{{lessonArabicExplanation}}".
Here are some examples from the lesson:
{{#each lessonExamples}}
- English: "{{this.english}}", Arabic: "{{this.arabic}}"
{{/each}}
{{#if lessonAdditionalNotesArabic}}
Here are additional notes in Arabic: "{{lessonAdditionalNotesArabic}}"
{{else if lessonAdditionalNotes}}
Here are additional notes (in English, translate if needed for context): "{{lessonAdditionalNotes}}"
{{/if}}
{{#if lessonCommonMistakesArabic}}
Here are common mistakes in Arabic: "{{lessonCommonMistakesArabic}}"
{{else if lessonCommonMistakes}}
Here are common mistakes (in English, translate if needed for context): "{{lessonCommonMistakes}}"
{{/if}}

Now, consider the following interactive exercise and the student's answer:
{{#each lessonInteractiveExercises}}
Question: "{{this.question}}"
{{#if this.choices}}
Choices: {{#each this.choices}}"{{this}}" {{/each}}
{{/if}}
Correct Answer: "{{this.correct_answer}}"
Your Answer: "{{this.user_answer}}"
{{/each}}

Provide targeted feedback to the student IN ARABIC.
If the student's answer is correct, congratulate them in Arabic and perhaps offer a small additional tip or encouragement in Arabic.
If the student's answer is incorrect, explain IN ARABIC why it's incorrect, clarify the correct answer IN ARABIC, and reference specific sections of the lesson material (like the Arabic explanation or examples) to reinforce understanding. Be encouraging and helpful.
Ensure your entire feedback is in Arabic.
`,
});

const exerciseFeedbackFlow = ai.defineFlow(
  {
    name: 'exerciseFeedbackFlow',
    inputSchema: ExerciseFeedbackInputSchema,
    outputSchema: ExerciseFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
