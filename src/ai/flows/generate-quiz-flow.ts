
'use server';

/**
 * @fileOverview An AI agent for generating a quiz using Cloudflare AutoRAG.
 * This version uses AutoRAG to find the most relevant learning materials
 * and then generates one question at a time from the retrieved content.
 */
import type { GenerateQuizOutput, QuizQuestion } from '@/types/quiz';
import { generateSingleQuizQuestion } from './generate-single-quiz-question';
import { searchWithAutoRAG } from './autorag-flow';

const NUM_QUESTIONS_TO_GENERATE = 25;

export async function generateQuiz(): Promise<GenerateQuizOutput> {
  const generatedQuestions: QuizQuestion[] = [];
  
  // 1. Use AutoRAG to find the most relevant document chunks for a generic "English test" query.
  // This helps us pick the lessons with the richest content for generating questions.
  const query = "A comprehensive English language test covering grammar, vocabulary, and comprehension.";
  
  const searchResults = await searchWithAutoRAG({ query });
  const documents = searchResults.results;

  // We'll take a slice of the top results to ensure we don't make excessive API calls
  const itemsToQuery = documents.slice(0, NUM_QUESTIONS_TO_GENERATE);


  // 2. Generate questions one by one from the retrieved, high-quality document chunks
  for (const item of itemsToQuery) {
      if (generatedQuestions.length >= NUM_QUESTIONS_TO_GENERATE) {
        break;
      }

      try {
        const content = `Title: ${item.source.name}\nContent: ${item.text}`;
        
        const question = await generateSingleQuizQuestion({ learningMaterial: content });
        
        if (question) {
            generatedQuestions.push(question);
        }
      } catch (error) {
          // Log the error but continue to the next item
          console.error(`Failed to generate a question for document: "${item.source.name}". Skipping.`, error);
      }
  }

  // 3. Return the collected questions
  return { questions: generatedQuestions };
}
