'use server';
/**
 * @fileOverview A flow for finding the most relevant document from a list using a reranker model.
 */
import { z } from 'zod';

const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN;
const MODEL_NAME = '@cf/baai/bge-reranker-base';

/**
 * Finds the most relevant document for a given query.
 * @param query The user's question or search term.
 * @param documents An array of strings representing the documents to search through.
 * @returns The index of the most relevant document in the array, or null if an error occurs.
 */
export async function findMostRelevantLesson(query: string, documents: string[]): Promise<number | null> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${MODEL_NAME}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        contexts: documents.map(doc => ({ text: doc })),
        top_k: 1, // We only need the single best match
      }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Cloudflare Reranker API error:", errorText);
        throw new Error(`Cloudflare Reranker API request failed: ${response.statusText}`);
    }

    const jsonResponse = await response.json();

    if (jsonResponse.success && jsonResponse.result && jsonResponse.result.response.length > 0) {
      // The response is an array of ranked results. The 'id' is the original index.
      return jsonResponse.result.response[0].id;
    }

    return null; // No relevant lesson found

  } catch (error) {
    console.error("Error in reranker flow:", error);
    return null; // Return null on error to indicate failure gracefully
  }
}
