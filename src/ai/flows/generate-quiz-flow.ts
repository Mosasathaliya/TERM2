
'use server';

/**
 * @fileOverview An AI agent for generating a quiz using Cloudflare AutoRAG.
 * This version uses AutoRAG to find the most relevant learning materials
 * and then generates questions in parallel from the retrieved content.
 */
import type { GenerateQuizOutput, QuizQuestion } from '@/types/quiz';
import { generateSingleQuizQuestion } from './generate-single-quiz-question';
import { searchWithAutoRAG } from './autorag-flow';
import { learningItems } from '@/lib/lessons';
import { vectorizeQuery } from '@/lib/vectorize';

const NUM_QUESTIONS_TO_GENERATE = 25;

export async function generateQuiz(): Promise<GenerateQuizOutput> {
  const query = "A comprehensive English language test covering grammar, vocabulary, and comprehension.";
  let materials: { title: string; content: string }[] = [];
  try {
    const searchResults = await searchWithAutoRAG({ query });
    materials = searchResults.results.map(r => ({ title: r.source.name, content: r.text }));
  } catch (e) {
    // Try Vectorize as a fallback if available
    try {
      const matches = await vectorizeQuery(query, NUM_QUESTIONS_TO_GENERATE);
      materials = matches.map((m: any) => ({ title: m?.metadata?.title || 'Material', content: m?.metadata?.content || '' }));
    } catch (e2) {
      // Final fallback: use in-repo learning items
      materials = learningItems.slice(0, NUM_QUESTIONS_TO_GENERATE).map(item => ({
        title: item.title,
        content: item.type === 'lesson' ? item.explanation : item.content,
      }));
    }
  }

  const toQuery = materials.slice(0, NUM_QUESTIONS_TO_GENERATE);
  const results = await Promise.all(
    toQuery.map((m) =>
      generateSingleQuizQuestion({ learningMaterial: `Title: ${m.title}\nContent: ${m.content}` }).catch(
        (err) => {
          console.error(`Failed to generate a question for material: "${m.title}". Skipping.`, err);
          return null;
        }
      )
    )
  );
  const questions = results.filter((q): q is QuizQuestion => q !== null);
  return { questions };
}
