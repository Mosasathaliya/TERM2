
'use server';

/**
 * @fileOverview An AI agent for generating a quiz from a text document using Cloudflare Workers AI.
 * This version is updated to be more robust by generating one question at a time
 * from a random subset of learning materials.
 */
import type { GenerateQuizOutput, QuizQuestion } from '@/types/quiz';
import { learningItems, type LearningItem } from '@/lib/lessons';
import { generateSingleQuizQuestion } from './generate-single-quiz-question';

// Function to shuffle an array and pick the first N items
function getRandomItems<T>(array: T[], numItems: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numItems);
}


export async function generateQuiz(): Promise<GenerateQuizOutput> {
  // 1. Select 20 random learning items
  const selectedItems = getRandomItems(learningItems, 20);

  try {
    // 2. Generate one question for each item in parallel
    const questionPromises = selectedItems.map(item => {
        let content = '';
        if (item.type === 'lesson') {
            content = `Title: ${item.title}\nExplanation: ${item.explanation}\nStory: ${item.story?.summary || ''}`;
        } else {
            content = `Story: ${item.title}\nContent: ${item.content}`;
        }
        return generateSingleQuizQuestion({ learningMaterial: content });
    });

    const results = await Promise.all(questionPromises);
    
    // Filter out any null results from failed generations
    const validQuestions = results.filter((q): q is QuizQuestion => q !== null);

    // 3. Return the collected questions
    // Even if some questions fail, we return the ones that succeeded.
    return { questions: validQuestions };

  } catch(error) {
      console.error("Failed to generate the full quiz, returning what was successful", error);
      // In case of a catastrophic failure in Promise.all (less likely now), return empty.
      return { questions: [] };
  }
}
