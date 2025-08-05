// src/lib/cloudflare-ai.ts
'use server';

const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN;

if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
  throw new Error("Cloudflare AI credentials are not set in the environment variables.");
}

type AiModel = 
  | '@cf/meta/llama-3-8b-instruct'
  | '@cf/meta/m2m100-1.2b' // Added translation model to the type
  | '@cf/baai/bge-reranker-base'
  | '@cf/stabilityai/stable-diffusion-xl-base-1.0' // Added image generation model to the type
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

  // The translation model expects a different payload structure.
  // Other models wrap inputs in an "inputs" object, but the translation model does not.
  const body = model === '@cf/meta/m2m100-1.2b' 
    ? { ...inputs, stream }
    : stream 
      ? { ...inputs, stream: true } 
      : inputs;


  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Cloudflare AI API error for model ${model}:`, errorText);
    throw new Error(`Cloudflare AI API request failed: ${response.statusText}`);
  }

  return response;
}
