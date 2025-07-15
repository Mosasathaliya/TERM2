'use server';

import { answerQuestions } from '@/ai/flows/answer-questions';
import type { AnswerQuestionsOutput } from '@/ai/flows/answer-questions';

export async function askAI(question: string): Promise<{ answer: string | null; error: string | null }> {
  if (!question) {
    return { answer: null, error: 'Question cannot be empty.' };
  }

  try {
    const result: AnswerQuestionsOutput = await answerQuestions({ question });
    return { answer: result.answer, error: null };
  } catch (e) {
    console.error(e);
    // This is a user-facing error message. Be careful what you expose.
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { answer: null, error: `Failed to get an answer from the AI. ${errorMessage}` };
  }
}
