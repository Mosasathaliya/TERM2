
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
  // 1. Select 25 random learning items for a faster, more focused quiz
  const selectedItems = getRandomItems(learningItems, 25);
  const generatedQuestions: QuizQuestion[] = [];
  
  // 2. Generate questions one by one for better stability
  for (const item of selectedItems) {
      try {
        let content = '';
        if (item.type === 'lesson') {
            content = `Title: ${item.title}\nExplanation: ${item.explanation}\nStory: ${item.story?.summary || ''}`;
        } else {
            content = `Story: ${item.title}\nContent: ${item.content}`;
        }
        
        const question = await generateSingleQuizQuestion({ learningMaterial: content });
        
        if (question) {
            generatedQuestions.push(question);
        }
      } catch (error) {
          // Log the error but continue to the next item
          console.error(`Failed to generate a question for item: "${item.title}". Skipping.`, error);
      }
  }

  // 3. Return the collected questions
  // Even if some questions fail, we return the ones that succeeded.
  return { questions: generatedQuestions };
}
