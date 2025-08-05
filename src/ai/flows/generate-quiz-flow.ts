
'use server';

/**
 * @fileOverview An AI agent for generating a quiz from a text document using Cloudflare Workers AI.
 * This version is updated to select a random subset of learning materials to make the
 * generation process more reliable.
 */
import type { GenerateQuizOutput } from '@/types/quiz';
import { learningItems, type LearningItem } from '@/lib/lessons';
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
            content: `You are an expert quiz creator. Your task is to generate a JSON object representing a quiz based on the provided learning material. The JSON object MUST have a key "questions" which is an array of exactly 20 unique multiple-choice question objects. Each question object must have keys "question", "options" (an array of 4 strings), and "correct_answer". Do not output any text other than the JSON object itself.`
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

// Function to shuffle an array and pick the first N items
function getRandomItems<T>(array: T[], numItems: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numItems);
}


export async function generateQuiz(): Promise<GenerateQuizOutput> {
  // 1. Select 20 random learning items
  const selectedItems = getRandomItems(learningItems, 20);

  // 2. Create the learning material string from the selected items
  const learningMaterial = selectedItems.map((item, index) => {
      let content = '';
      if (item.type === 'lesson') {
          content = `Title: ${item.title}\nExplanation: ${item.explanation}\nStory: ${item.story?.summary || ''}`;
      } else {
          content = `Story: ${item.title}\nContent: ${item.content}`;
      }
      return `--- ITEM ${index + 1} ---\n${content}`;
  }).join('\n\n');

  // 3. Create a more focused prompt
  const prompt = `Based on the following 20 English learning items, generate a quiz with exactly 20 unique multiple-choice questions. 
  
  Your task is to create ONE question for EACH of the 20 items provided. Each question must test a key concept, vocabulary word, or comprehension point from its corresponding item.
  
  Each question object in the JSON output must have 4 options and a clearly indicated correct answer.

  Here is the material:
  ---
  ${learningMaterial}
  ---`;
  
  try {
      const output = await queryCloudflareAsJson(prompt);
      // Ensure the output conforms to the expected structure, even if the AI doesn't provide 20 questions.
      if (output && Array.isArray(output.questions)) {
          return { questions: output.questions };
      }
      return { questions: [] };
  } catch(error) {
      console.error("Failed to generate quiz, returning empty quiz", error);
      return { questions: [] };
  }
}
