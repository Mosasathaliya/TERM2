// src/lib/cloudflare-ai.ts
'use server';

const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN;

if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
  throw new Error("Cloudflare AI credentials are not set in the environment variables.");
}

type AiModel = 
  | '@cf/meta/llama-3-8b-instruct'
  | '@cf/baai/bge-reranker-base'
  | '@cf/black-forest-labs/flux-1-schnell'
  | '@cf/myshell-ai/melotts'
  | '@cf/openai/whisper';

interface RunAiOptions {
  model: AiModel;
  inputs: object;
  stream?: boolean;
}

/**
 * A centralized function to run any Cloudflare AI model.
 * @param model The AI model to run.
 * @param inputs The inputs for the model.
 * @param stream Whether to stream the response (for text generation).
 * @returns The model's response.
 */
export async function runAi({ model, inputs, stream = false }: RunAiOptions) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${model}`;
  
  const headers = {
    'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(stream ? { ...inputs, stream: true } : inputs),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Cloudflare AI API error for model ${model}:`, errorText);
    throw new Error(`Cloudflare AI API request failed: ${response.statusText}`);
  }

  return response;
}
