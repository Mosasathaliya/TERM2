'use server';

import { runAi } from '@/lib/cloudflare-ai';
import { generateImage } from '@/ai/flows/image-generation-flow';
import type { QuizQuestion } from '@/types/quiz';

export interface EnrichedAiLessonOutput {
  enrichedEnglish: string;
  imageUrls: string[];
  quiz: QuizQuestion[];
}

export async function enrichAiLessonInEnglish(title: string, seedContent: string, imageHint?: string): Promise<EnrichedAiLessonOutput> {
  const system = [
    'You are a world-class English educational writer who updates content with current knowledge and clarity.',
    'Write in English only. Keep structure: Overview → Key ideas with bullets → Practical examples → Summary.',
    'Be up-to-date and accurate. If uncertain, generalize rather than speculate.',
  ].join('\n');

  const user = `Improve and enrich the following chapter titled "${title}", updating it with current context where helpful. Keep it concise yet robust:
---
${seedContent}
---`;

  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];

  const primaryModel = (process as any)?.env?.CLOUDFLARE_PRIMARY_TEXT_MODEL || '@cf/meta/llama-3-8b-instruct';
  const response = await runAi({ model: primaryModel, inputs: { messages } });
  const json = await response.json();
  const enrichedEnglish: string = json.result.response as string;

  // Generate 2 images
  const prompts = [
    `${title} ${imageHint ?? ''}`.trim(),
    `Conceptual illustration of ${title} ${imageHint ?? ''}`.trim(),
  ];
  const uniquePrompts = Array.from(new Set(prompts));
  const imageUrls = await Promise.all(uniquePrompts.map(async (p) => {
    try {
      const img = await generateImage({ prompt: p });
      return img.imageUrl;
    } catch {
      return `https://placehold.co/600x400/222222/FFFFFF.png?text=${encodeURIComponent(title)}`;
    }
  }));

  // Generate robust English quiz (5 Qs) based on enriched content
  const quizSystem = 'You are an expert quiz creator. Output ONLY a valid JSON object with key "questions": array of 5 objects with keys question, options[4], correct_answer (exact string match).';
  const quizUser = `Create a short multiple-choice quiz (5 questions) based strictly on this chapter:
${enrichedEnglish}`;
  const quizMessages = [
    { role: 'system', content: quizSystem },
    { role: 'user', content: quizUser },
  ];
  const quizResp = await runAi({ model: primaryModel, inputs: { messages: quizMessages } });
  const quizJson = await quizResp.json();
  const text = quizJson.result.response as string;
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  let quiz: QuizQuestion[] = [];
  try {
    if (start !== -1 && end !== -1) {
      const parsed = JSON.parse(text.substring(start, end + 1));
      if (Array.isArray(parsed.questions)) quiz = parsed.questions;
    }
  } catch {}

  return { enrichedEnglish, imageUrls, quiz };
}

export async function translateAiLessonToArabic(english: string): Promise<string> {
  const system = 'ترجم النص التالي إلى العربية الفصحى بدقة وبأسلوب تعليمي واضح. اترك المصطلحات التقنية الأساسية بالإنجليزية بين قوسين عند الحاجة.';
  const user = english;
  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];
  const primaryModel = (process as any)?.env?.CLOUDFLARE_PRIMARY_TEXT_MODEL || '@cf/meta/llama-3-8b-instruct';
  const resp = await runAi({ model: primaryModel, inputs: { messages } });
  const j = await resp.json();
  return j.result.response as string;
}