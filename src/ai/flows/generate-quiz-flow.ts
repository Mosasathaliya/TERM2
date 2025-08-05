'use server';

/**
 * @fileOverview An AI agent for generating a quiz from a text document using Cloudflare Workers AI.
 */
import type { GenerateQuizOutput } from '@/types/quiz';
import { learningItems } from '@/lib/lessons';
import { runAi } from '@/lib/cloudflare-ai';


function isBalanced(str: string) {
    const stack = [];
    const map: Record<string, string> = {
        '(': ')',
        '[': ']',
        '{': '}'
    };
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (map[char]) {
            stack.push(char);
        } else if (Object.values(map).includes(char)) {
            if (map[stack.pop()!] !== char) {
                return false;
            }
        }
    }
    return stack.length === 0;
}


async function queryCloudflareAsJson(prompt: string): Promise<any> {
    const messages = [
        {
            role: "system",
            content: `You are an expert quiz creator. Your task is to generate a JSON object representing a quiz based on the provided learning material. The JSON object MUST have a key "questions" which is an array of exactly 20 unique multiple-choice question objects. Each question object must have keys "question", "options" (an array of 4 strings), and "correct_answer". Do not output any text other than the JSON object.`
        },
        {
            role: "user",
            content: prompt,
        }
    ];
    
    const response = await runAi({ model: '@cf/meta/llama-3-8b-instruct', inputs: { messages } });
    const jsonResponse = await response.json();
    try {
        const responseText = jsonResponse.result.response;
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
             const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
             if (isBalanced(jsonString)) {
                return JSON.parse(jsonString);
             }
        }
        throw new Error("Incomplete or invalid JSON object found in response");
    } catch (e) {
        console.error("Failed to parse JSON from Cloudflare AI:", jsonResponse.result.response, e);
        throw new Error("Failed to parse JSON from AI response.");
    }
}

export async function generateQuiz(): Promise<GenerateQuizOutput> {
  const learningMaterial = learningItems.map(item => {
      if (item.type === 'lesson') {
          return `Title: ${item.title}\nExplanation: ${item.explanation}\nStory: ${item.story?.summary || ''}`;
      } else {
          return `Story: ${item.title}\nContent: ${item.content}`;
      }
  }).join('\n\n---\n\n');

  const prompt = `Based on the following English learning material, generate a quiz with exactly 20 unique multiple-choice questions. Each question must have 4 options, and you must clearly indicate the correct answer. The questions should cover the various grammar points, vocabulary, and concepts presented in the text. Ensure the questions are varied and test different aspects of the material.

  Here is the material:
  ---
  ${learningMaterial}
  ---`;
  
  try {
      const output = await queryCloudflareAsJson(prompt);
      return output;
  } catch(error) {
      console.error("Failed to generate quiz, returning empty quiz", error);
      return { questions: [] };
  }
}
