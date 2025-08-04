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

async function queryNVIDIA(data: any) {
    const API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
    const response = await fetch(API_URL, {
        headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_NVIDIA_API_KEY}`,
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error("NVIDIA API error:", errorText);
        throw new Error(`NVIDIA API request failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.choices[0]?.message?.content || "";
}


export async function explainVideoTopic({ videoTitle }: ExplainVideoInput): Promise<ExplainVideoOutput> {
    const prompt = `You are an expert science communicator for an Arabic-speaking audience. The user is watching a YouTube video from the 'What If' series titled: "${videoTitle}".

Your task is to provide three distinct types of explanations for the main topic of this video, all in simple, clear Arabic.

The output must be a single, valid JSON object with three keys:
1. "summary": A concise, one-paragraph summary of the video's main idea.
2. "keyConcepts": A list and brief explanation of 2-3 key scientific or theoretical concepts discussed in the video.
3. "analogy": A simple analogy or comparison to a more familiar concept to help a beginner understand the core idea.

The entire response must be only the JSON object, with no other text before or after it.

Here is the JSON object:`;
    
    const nvidiaResponse = await queryNVIDIA({
        model: "meta/llama-4-maverick-17b-128e-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300
    });

    try {
        const cleanedResponse = nvidiaResponse.match(/\{[\s\S]*\}/)?.[0];
        if (!cleanedResponse) {
            throw new Error("No JSON object found in the response.");
        }
        const output = JSON.parse(cleanedResponse);
        return ExplainVideoOutputSchema.parse(output);
    } catch (error) {
        console.error("Failed to parse NVIDIA response as JSON:", error);
        // Fallback for non-JSON response
        return {
            summary: "شرح غير متوفر حاليًا.",
            keyConcepts: "شرح غير متوفر حاليًا.",
            analogy: "شرح غير متوفر حاليًا.",
        };
    }
}
