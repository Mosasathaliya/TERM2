
'use server';
/**
 * @fileOverview A flow to generate explanations for a YouTube video topic, using Hugging Face.
 */
import { z } from 'zod';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/microsoft/Phi-3-vision-128k-instruct";

export type ExplainVideoInput = z.infer<typeof ExplainVideoInputSchema>;
const ExplainVideoInputSchema = z.object({
  videoTitle: z.string().describe('The title of the YouTube video to be explained.'),
});

export type ExplainVideoOutput = z.infer<typeof ExplainVideoOutputSchema>;
const ExplainVideoOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the video topic in simple Arabic.'),
  keyConcepts: z.string().describe('A list of key concepts from the video, explained simply in Arabic.'),
  analogy: z.string().describe('An analogy or simple comparison to help understand the topic, in Arabic.'),
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

function formatPrompt(videoTitle: string) {
    const systemPrompt = `You are an expert science communicator for an Arabic-speaking audience. The user is watching a YouTube video from the 'What If' series titled: "${videoTitle}".

Your task is to provide three distinct types of explanations for the main topic of this video, all in simple, clear Arabic.

1.  **Summary (summary)**: Provide a concise, one-paragraph summary of the video's main idea.
2.  **Key Concepts (keyConcepts)**: List and briefly explain 2-3 key scientific or theoretical concepts discussed in the video.
3.  **Analogy (analogy)**: Create a simple analogy or comparison to a more familiar concept to help a beginner understand the core idea.

Ensure all three explanations are in simple Arabic and are easy to understand.
You MUST respond with only a valid JSON object in the format:
{
  "summary": "...",
  "keyConcepts": "...",
  "analogy": "..."
}
Do not include any other text or markdown formatting like \`\`\`json.`;

    return `<|system|>\n${systemPrompt}<|end|>\n<|user|>\nExplain the video "${videoTitle}".<|end|>\n<|assistant|>`;
}


export async function explainVideoTopic(
  input: ExplainVideoInput
): Promise<ExplainVideoOutput> {
  if (!HUGGING_FACE_API_KEY) {
    throw new Error("Hugging Face API key is not configured.");
  }
  
  const huggingFacePayload = {
      inputs: formatPrompt(input.videoTitle),
      parameters: {
          max_new_tokens: 1024,
          return_full_text: false,
      },
  };

  try {
      const result = await queryHuggingFace(huggingFacePayload);
      const responseText = result[0]?.generated_text;
      
      if (!responseText) {
          throw new Error("AI did not return any text.");
      }
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
          throw new Error("AI response did not contain a valid JSON object.");
      }
      
      const parsedJson = JSON.parse(jsonMatch[0]);
      return ExplainVideoOutputSchema.parse(parsedJson);

  } catch (error) {
      console.error("Explain video topic error:", error);
      throw new Error("Failed to generate video explanation.");
  }
}
