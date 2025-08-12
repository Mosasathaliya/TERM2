
'use server';

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || process.env.CF_API_TOKEN;

async function resolveAccountId(): Promise<string> {
  // Prefer explicit env if provided
  if (process.env.CLOUDFLARE_ACCOUNT_ID) {
    return process.env.CLOUDFLARE_ACCOUNT_ID as string;
  }
  // Cache between calls during runtime
  // @ts-ignore
  if (globalThis.__cfAccountId) {
    // @ts-ignore
    return globalThis.__cfAccountId as string;
  }
  if (!CLOUDFLARE_API_TOKEN) {
    throw new Error('CLOUDFLARE_API_TOKEN is required to auto-resolve Account ID.');
  }
  const res = await fetch('https://api.cloudflare.com/client/v4/accounts', {
    headers: { Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to resolve Cloudflare Account ID: ${res.status} ${text}`);
  }
  const json = await res.json();
  const accounts = json?.result || [];
  if (!accounts.length || !accounts[0]?.id) {
    throw new Error('No Cloudflare accounts found for the provided token.');
  }
  const id = accounts[0].id as string;
  // @ts-ignore
  globalThis.__cfAccountId = id;
  return id;
}

type AiModel = 
  | '@cf/meta/llama-3-8b-instruct'
  | '@cf/meta/m2m100-1.2b'
  | '@cf/baai/bge-reranker-base'
  | '@cf/baai/bge-base-en-v1.5'
  | '@cf/stabilityai/stable-diffusion-xl-base-1.0'
  | '@cf/myshell-ai/melotts'
  | '@cf/openai/whisper';

interface RunAiOptions {
  model: AiModel;
  inputs: object;
  stream?: boolean;
}

/**
 * A centralized function to run any Cloudflare AI model via the AI Gateway.
 * @param model The AI model to run.
 * @param inputs The inputs for the model.
 * @param stream Whether to stream the response (for text generation).
 * @returns The model's response.
 */
export async function runAi({ model, inputs, stream = false }: RunAiOptions) {
  const CLOUDFLARE_ACCOUNT_ID = await resolveAccountId();
  const directUrl = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${model}`;

  let body: any;
  const headers: HeadersInit = { Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}` } as HeadersInit;

  // Whisper expects raw audio
  if (model.includes('whisper') && 'audio' in inputs && (inputs as any).audio && (((inputs as any).audio) instanceof Buffer || ((inputs as any).audio) instanceof Uint8Array)) {
    (headers as any)['Content-Type'] = 'application/octet-stream';
    body = (inputs as any).audio;
  } else {
    (headers as any)['Content-Type'] = 'application/json';
    body = JSON.stringify(stream ? { ...inputs, stream: true } : inputs);
  }

  const response = await fetch(directUrl, { method: 'POST', headers, body });
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Cloudflare AI Direct API error for model ${model}:`, errorText);
    throw new Error(`Cloudflare AI Direct API request failed: ${response.statusText}`);
  }
  return response;
}
