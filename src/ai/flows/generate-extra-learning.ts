'use server';

import { runAi } from '@/lib/cloudflare-ai';
import { generateImage } from '@/ai/flows/image-generation-flow';

export interface ExtraLearningOutput {
  explanation: string; // Arabic text with embedded English keywords/phrases where helpful
  imageUrls: string[]; // 2-3 illustrative images
}

export async function generateExtraLearning(topic: string, imageHint?: string): Promise<ExtraLearningOutput> {
  const system = [
    'أنت معلّم عربي متمرس تشرح المفاهيم التعليمية بوضوح شديد وبأسلوب مبسط.',
    'اكتب الشرح كاملاً باللغة العربية، ولكن عندما تذكر المصطلحات الإنجليزية الأساسية استخدم الإنجليزية ضمن السياق (EN).',
    'الهيكل: مقدمة موجزة → شرح تفصيلي منظم بنقاط → أمثلة تطبيقية (جمل EN مع تفسير عربي قصير) → ملخص ونصائح.',
    'اكتب شرحًا غنيًا وقويًا لكنه سهل الفهم ومباشر.',
  ].join('\n');

  const user = `قدّم شرحًا قويًا ومبسّطًا حول الموضوع التالي: "${topic}". اجعل الشرح بالعربية، واذكر المصطلحات الأساسية بالإنجليزية عند الحاجة مع أمثلة قصيرة.`;

  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];

  const primaryModel = (process as any)?.env?.CLOUDFLARE_PRIMARY_TEXT_MODEL || '@cf/meta/llama-3-8b-instruct';
  const response = await runAi({ model: primaryModel, inputs: { messages } });
  const json = await response.json();
  const explanation: string = json.result.response as string;

  // Generate 2-3 images themed on the topic
  const prompts = [
    `${topic} ${imageHint ?? ''}`.trim(),
    `Illustration of ${topic} in an educational context ${imageHint ?? ''}`.trim(),
    `Concept diagram of ${topic} ${imageHint ?? ''}`.trim(),
  ];

  const uniquePrompts = Array.from(new Set(prompts)).slice(0, 3);
  const images = await Promise.all(uniquePrompts.map(async (p) => {
    try {
      const img = await generateImage({ prompt: p });
      return img.imageUrl;
    } catch {
      return `https://placehold.co/600x400/222222/FFFFFF.png?text=${encodeURIComponent(topic)}`;
    }
  }));

  return { explanation, imageUrls: images };
}
