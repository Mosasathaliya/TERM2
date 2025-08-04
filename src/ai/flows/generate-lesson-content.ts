'use server';
/**
 * @fileOverview Generates lesson content for English grammar topics targeted at Arabic-speaking students.
 */
import { z } from 'zod';

const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN;
const MODEL_NAME = '@cf/meta/llama-3-8b-instruct';

async function queryCloudflare(prompt: string): Promise<any> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${MODEL_NAME}`;
    
    const messages = [
        {
            role: "system",
            content: `You are an expert English grammar lesson creator for Arabic-speaking students. Your task is to generate a single, valid JSON object based on the user's request. The JSON object must have keys: "arabicExplanation", "examples" (an array of objects with 'english' and 'arabic' keys), "additionalNotesInArabic", and "commonMistakesInArabic". Do not output any text other than the JSON object.`
        },
        {
            role: "user",
            content: prompt,
        }
    ];
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages, raw: true }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Cloudflare AI API error:", errorText);
        throw new Error(`Cloudflare AI API request failed: ${response.statusText}`);
    }
    
    const jsonResponse = await response.json();
    try {
      const responseText = jsonResponse.result.response;
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
          return JSON.parse(responseText.substring(jsonStart, jsonEnd + 1));
      }
      throw new Error("No valid JSON object found in response");
    } catch (e) {
      console.error("Failed to parse JSON from Cloudflare AI:", jsonResponse.result.response, e);
      throw new Error("Failed to parse JSON from AI response.");
    }
}


export type GenerateLessonContentInput = z.infer<typeof GenerateLessonContentInputSchema>;
const GenerateLessonContentInputSchema = z.object({
  lessonTitle: z.string().describe('The title of the lesson (e.g., "Present Simple Tense").'),
  englishGrammarTopic: z.string().describe('The specific English grammar topic to be explained (e.g., "Forming questions with Present Simple").'),
  lessonLevel: z.enum(["Beginner", "Intermediate", "Advanced"]).describe('The proficiency level of the target student (Beginner, Intermediate, or Advanced).'),
  englishAdditionalNotes: z.string().optional().describe('Optional existing English additional notes to provide context to the AI for generating Arabic notes.'),
  englishCommonMistakes: z.string().optional().describe('Optional existing English common mistakes to provide context to the AI for generating Arabic common mistakes.'),
});

const ExampleSchema = z.object({
    english: z.string().describe('An English example sentence demonstrating the grammar topic.'),
    arabic: z.string().describe('The Arabic translation of the English example sentence.'),
    imagePrompt: z.string().optional(),
    imageUrl: z.string().optional(),
});

export type GenerateLessonContentOutput = z.infer<typeof GenerateLessonContentOutputSchema>;
const GenerateLessonContentOutputSchema = z.object({
  arabicExplanation: z.string().describe('A clear and comprehensive explanation of the English grammar topic, written entirely in Arabic, suitable for the specified student level.'),
  examples: z.array(ExampleSchema).describe('3-5 clear English example sentences illustrating the grammar topic, each with its Arabic translation.'),
  additionalNotesInArabic: z.string().optional().describe('Helpful additional notes related to the grammar topic, written entirely in Arabic, suitable for the student level. This should be a paragraph or two.'),
  commonMistakesInArabic: z.string().optional().describe('Common mistakes Arabic-speaking students make related to this grammar topic, explained entirely in Arabic with examples if appropriate. This should be a paragraph or two.'),
});


export async function generateLessonContent(
  input: GenerateLessonContentInput
): Promise<GenerateLessonContentOutput> {
  const prompt = `Generate educational content for an English grammar lesson for Arabic-speaking students.
Lesson Title: "${input.lessonTitle}"
Topic: "${input.englishGrammarTopic}"
Level: "${input.lessonLevel}"
Contextual English Notes: "${input.englishAdditionalNotes}"
Contextual English Common Mistakes: "${input.englishCommonMistakes}"

Provide the output as a single JSON object with the keys specified in the output schema: "arabicExplanation", "examples" (an array of {english, arabic} objects), "additionalNotesInArabic", "commonMistakesInArabic".`;

  const output = await queryCloudflare(prompt);

  if (!output.examples || output.examples.length === 0) {
      output.examples = [{english: "Example placeholder.", arabic: "مثال مؤقت."}];
  }

  return GenerateLessonContentOutputSchema.parse(output);
}
