'use server';

import { runAi } from '@/lib/cloudflare-ai';

export interface GeneratedMcq {
  question: string;
  options: string[]; // 4 options
  answer: string;    // exact string match with one of options
}

export async function generateFiveMcqFromContent(params: { title: string; englishContext?: string; arabicContext?: string; }): Promise<GeneratedMcq[]> {
  const { title, englishContext = '', arabicContext = '' } = params;

  const system = [
    'You are an expert English-learning quiz generator.',
    'Write the quiz in English only.',
    'Output ONLY a valid JSON object with this shape: { "questions": [ { "question": string, "options": string[4], "answer": string } x5 ] }.',
    'Questions must be derived strictly from the provided context and title.',
    'Use clear, unambiguous wording and ensure exactly 4 options per question.',
  ].join('\n');

  const user = `Create 5 multiple-choice questions for the chapter or story titled "${title}".
Use the following context to derive facts, rules, or examples:
---
ENGLISH CONTEXT:
${englishContext}
---
ARABIC CONTEXT:
${arabicContext}
---`;

  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];

  const primaryModel = (process as any)?.env?.CLOUDFLARE_PRIMARY_TEXT_MODEL || '@cf/meta/llama-3-8b-instruct';
  const resp = await runAi({ model: primaryModel, inputs: { messages } });
  const j = await resp.json();
  const text = j.result.response as string;

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  let questions: GeneratedMcq[] = [];
  try {
    if (start !== -1 && end !== -1) {
      const parsed = JSON.parse(text.substring(start, end + 1));
      if (Array.isArray(parsed.questions)) questions = parsed.questions;
    }
  } catch {}

  // Soft validation and trimming
  questions = (questions || []).slice(0, 5).map((q) => ({
    question: String(q.question || '').trim(),
    options: Array.isArray(q.options) ? q.options.map((o: any) => String(o)).slice(0, 4) : [],
    answer: String(q.answer || '').trim(),
  })).filter(q => q.question && q.options.length === 4 && q.options.includes(q.answer));

  return questions;
}
