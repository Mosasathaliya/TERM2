'use server';
/**
 * @fileOverview A flow to generate explanations for a YouTube video topic.
 */
import { z } from 'zod';

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

async function queryHuggingFace(data: any) {
    const API_URL = "https://api-inference.huggingface.co/models/gpt2";
    const response = await fetch(API_URL, {
        headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}`,
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Hugging Face API error:", errorText);
        throw new Error(`Hugging Face API request failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result[0]?.generated_text || "";
}


export async function explainVideoTopic({ videoTitle }: ExplainVideoInput): Promise<ExplainVideoOutput> {
    const prompt = `You are an expert science communicator for an Arabic-speaking audience. The user is watching a YouTube video from the 'What If' series titled: "${videoTitle}".

Your task is to provide three distinct types of explanations for the main topic of this video, all in simple, clear Arabic.

1.  **Summary (summary)**: Provide a concise, one-paragraph summary of the video's main idea.
2.  **Key Concepts (keyConcepts)**: List and briefly explain 2-3 key scientific or theoretical concepts discussed in the video.
3.  **Analogy (analogy)**: Create a simple analogy or comparison to a more familiar concept to help a beginner understand the core idea.

The output should be a JSON object with keys "summary", "keyConcepts", and "analogy".

Here is the JSON object:`;
    
    const hfResponse = await queryHuggingFace({
      inputs: prompt,
      parameters: { max_new_tokens: 300, return_full_text: false }
    });

    try {
        // Since gpt2 doesn't do structured output well, we do our best to parse it
        const cleanedResponse = hfResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const output = JSON.parse(cleanedResponse);
        return ExplainVideoOutputSchema.parse(output);
    } catch (error) {
        console.error("Failed to parse Hugging Face response as JSON:", error);
        // Fallback for non-JSON response
        return {
            summary: "شرح غير متوفر حاليًا.",
            keyConcepts: "شرح غير متوفر حاليًا.",
            analogy: "شرح غير متوفر حاليًا.",
        };
    }
}
