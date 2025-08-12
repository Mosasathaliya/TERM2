'use server';

import { runAi } from '@/lib/cloudflare-ai';

export interface YouTubeSummaryOutput {
  arabicSummary: string;
}

// Naive transcript fetch placeholder — in production use YouTube Data API or a transcript service.
async function tryFetchTranscript(videoId: string): Promise<string | null> {
  try {
    // Placeholder: Not all videos have public transcripts; we fall back to title-based explain
    return null;
  } catch {
    return null;
  }
}

export async function summarizeYouTubeInArabic({ videoId, title }: { videoId: string; title: string }): Promise<YouTubeSummaryOutput> {
  const transcript = await tryFetchTranscript(videoId);

  const system = [
    'أنت معلّم عربي يقدّم ملخصات قوية وبسيطة لفيديوهات يوتيوب.',
    'اكتب ملخصًا بالعربية الفصحى مع إبراز المصطلحات الإنجليزية الأساسية داخل النص عند الحاجة.',
    'الهيكل: مقدمة قصيرة → أهم الأفكار بنقاط واضحة → أمثلة/تشبيهات → خلاصة.',
  ].join('\n');

  const user = transcript
    ? `لخّص المحتوى التالي من نص فيديو يوتيوب بشكل واضح بالعربية مع إبراز المصطلحات الإنجليزية الأساسية:
${transcript}`
    : `لم يتوفر نص للفيديو. لخّص موضوع هذا الفيديو اعتمادًا على عنوانه والمعرفة العامة:
Title: ${title}
اكتب الشرح بالعربية مع المصطلحات الإنجليزية الأساسية.`;

  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];

  const primaryModel = (process as any)?.env?.CLOUDFLARE_PRIMARY_TEXT_MODEL || '@cf/meta/llama-3-8b-instruct';
  const response = await runAi({ model: primaryModel, inputs: { messages } });
  const json = await response.json();
  const arabicSummary: string = json.result.response as string;
  return { arabicSummary };
}