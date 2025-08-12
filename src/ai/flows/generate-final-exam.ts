'use server';

import { runAi } from '@/lib/cloudflare-ai';
import { learningItems } from '@/lib/lessons';
import { aiLessons } from '@/lib/ai-lessons';
import type { QuizQuestion } from '@/types/quiz';

export interface FinalExamOutput {
  questions: QuizQuestion[]; // 100 questions
}

export async function generateFinalExam(): Promise<FinalExamOutput> {
  // Build a compact context of our internal materials
  const lessonSummaries = learningItems.slice(0, 200).map(item => `${item.title}: ${item.type === 'lesson' ? item.explanation : item.content}`).join('\n---\n');
  const aiSummaries = aiLessons.map(l => `${l.title}: ${l.content}`).join('\n---\n');

  const system = 'You are an expert exam builder. Output ONLY a valid JSON object with key "questions": array of exactly 100 objects with keys question, options (array of 4 strings), correct_answer (string). All questions must be in English and based strictly on the provided context.';
  const user = `Create a 100-question multiple-choice final exam (English only) based STRICTLY on this context from our app content. Avoid questions outside the context. Keep questions varied, covering grammar, vocabulary, and AI lesson comprehension. Use short, clear phrasing.
---
${lessonSummaries}
---
${aiSummaries}`;

  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];

  const primaryModel = (process as any)?.env?.CLOUDFLARE_PRIMARY_TEXT_MODEL || '@cf/meta/llama-3-8b-instruct';
  const resp = await runAi({ model: primaryModel, inputs: { messages } });
  const j = await resp.json();
  const text = j.result?.response as string;
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  let questions: QuizQuestion[] = [];
  try {
    if (start !== -1 && end !== -1) {
      const parsed = JSON.parse(text.substring(start, end + 1));
      if (Array.isArray(parsed.questions)) questions = parsed.questions;
    }
  } catch {}

  // Ensure length 100 by trimming or fill with simple review if short
  if (questions.length > 100) questions = questions.slice(0, 100);
  while (questions.length < 100) {
    questions.push({ question: 'Review: Choose the correct option.', options: ['A', 'B', 'C', 'D'], correct_answer: 'A' });
  }

  return { questions };
}
