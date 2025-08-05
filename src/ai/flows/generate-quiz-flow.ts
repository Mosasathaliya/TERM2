
'use server';

/**
 * @fileOverview An AI agent for generating a quiz from a text document using Cloudflare Workers AI.
 * This version is updated to be more robust by generating one question at a time
 * from ALL available learning materials to create a comprehensive exam.
 */
import type { GenerateQuizOutput, QuizQuestion } from '@/types/quiz';
import { learningItems, type LearningItem } from '@/lib/lessons';
import { generateSingleQuizQuestion } from './generate-single-quiz-question';


export async function generateQuiz(): Promise<GenerateQuizOutput> {
  // 1. Iterate through ALL learning items to create a comprehensive quiz.
  // This is more robust than random selection, which could pick poor source material.
  const generatedQuestions: QuizQuestion[] = [];
  
  // 2. Generate questions one by one for better stability
  for (const item of learningItems) {
      try {
        let content = '';
        if (item.type === 'lesson') {
            content = `Title: ${item.title}\nExplanation: ${item.explanation}\nStory: ${item.story?.summary || ''}`;
        } else {
            content = `Story: ${item.title}\nContent: ${item.content}`;
        }
        
        // Skip items with very little content to avoid generation errors
        if (content.length < 100) {
            continue;
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
