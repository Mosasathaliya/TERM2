'use server';

import { runAi } from '@/lib/cloudflare-ai';
import { findMostRelevantLesson } from '@/ai/flows/reranker-flow';
import { learningItems } from '@/lib/lessons';
import { aiLessons } from '@/lib/ai-lessons';

export interface CoachChatMessage { role: 'user' | 'assistant'; content: string }
export interface CoachChatInput { message: string; history: CoachChatMessage[] }
export interface CoachChatOutput { answer: string }

export async function coachChat({ message, history }: CoachChatInput): Promise<CoachChatOutput> {
  // Build internal documents from app knowledge only
  const liDocs = learningItems.map(item => `${item.title}: ${item.type === 'lesson' ? item.explanation : item.content}`);
  const aiDocs = aiLessons.map(l => `${l.title}: ${l.content}`);

  // Pick most relevant lesson content
  let lessonContext = '';
  try {
    const idx = await findMostRelevantLesson(message, liDocs);
    if (idx !== null && idx >= 0) lessonContext = liDocs[idx];
  } catch {}

  const aiContext = aiDocs.slice(0, 20).join('\n---\n'); // small set; aiLessons list is short

  const system = [
    'أنت مدرّب تعلم باللغة العربية داخل هذا التطبيق فقط.',
    'أجب دائمًا بالعربية، وساعد المستخدم على التخطيط للتعلم خطوة بخطوة اعتمادًا على محتوى التطبيق.',
    'استخدم فقط المعرفة في سياق التطبيق المقدم أدناه (دروس وقائمة AI Lessons).',
    'إذا لم تجد معلومة في السياق، قل: "لا أملك معلومات كافية في التطبيق حول هذا" ثم اقترح مسار تعلم بديل من الدروس المتاحة.',
    'التزم بالإيجاز المفيد، وقدّم خطة تعلم عملية (بنود مرقّمة أو نقاط) وروابط/عناوين من محتوى التطبيق إن لزم.',
  ].join('\n');

  const context = [
    '--- سياق من دروس اللغة (مختار):',
    lessonContext || 'لا سياق محدّد متاح',
    '\n--- سياق من AI Lessons:',
    aiContext,
  ].join('\n');

  const primaryModel = (process as any)?.env?.CLOUDFLARE_PRIMARY_TEXT_MODEL || '@cf/meta/llama-3-8b-instruct';
  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: `السياق (من التطبيق فقط):\n${context}` },
    ...history.map(h => ({ role: h.role === 'assistant' ? 'assistant' : 'user', content: h.content })),
    { role: 'user', content: `سؤال المستخدم: ${message}\nأجب بالعربية فقط، واعتمد على السياق.` },
  ];

  const resp = await runAi({ model: primaryModel, inputs: { messages } });
  const j = await resp.json();
  const answer = (j.result?.response as string) || 'عذرًا، لم أتمكن من توليد إجابة الآن.';
  return { answer };
}