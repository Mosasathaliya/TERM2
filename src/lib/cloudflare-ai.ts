
'use server';

const getEnv = (key: string): string => {
  const value = (process as any)?.env?.[key];
  if (!value) throw new Error(`${key} is not set in the environment variables.`);
  return value;
};

export type AiModel = string;

interface RunAiOptions {
  model: AiModel;
  inputs: any;
  stream?: boolean;
}

export async function runAi({ model, inputs, stream = false }: RunAiOptions) {
  const CLOUDFLARE_API_TOKEN = getEnv('CLOUDFLARE_API_TOKEN');
  const CLOUDFLARE_AI_GATEWAY_URL = (process as any)?.env?.CLOUDFLARE_AI_GATEWAY_URL;

  const isImageOrAudio = model.includes('stable-diffusion') || model.includes('melotts') || model.includes('whisper');
  const isTextGeneration = model.includes('llama') || model.includes('mixtral') || model.includes('qwen') || model.includes('deepseek');

  if (isImageOrAudio) {
    const CLOUDFLARE_ACCOUNT_ID = getEnv('CLOUDFLARE_ACCOUNT_ID');
    const directUrl = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${model}`;

    let body: any;
    const headers: HeadersInit = { Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}` };

    if (model.includes('whisper') && inputs && inputs.audio && (inputs.audio instanceof Uint8Array)) {
      headers['Content-Type'] = 'application/octet-stream';
      body = inputs.audio;
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(inputs ?? {});
    }

    const response = await fetch(directUrl, { method: 'POST', headers, body });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Cloudflare AI Direct API error for model ${model}:`, errorText);
      throw new Error(`Cloudflare AI Direct API request failed: ${response.statusText}`);
    }

    return response;
  }

  if (!CLOUDFLARE_AI_GATEWAY_URL) {
    throw new Error('CLOUDFLARE_AI_GATEWAY_URL is not set for gateway-based requests.');
  }

  const body = {
    ...(isTextGeneration && stream ? { stream: true } : {}),
    ...inputs,
  };

  const gatewayPayload = {
    provider: 'workers-ai',
    endpoint: model,
    query: body,
    headers: {
      Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
    },
  };

  const response = await fetch(CLOUDFLARE_AI_GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-gateway-mode': 'single',
    },
    body: JSON.stringify(gatewayPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Cloudflare AI Gateway error for model ${model}:`, errorText);
    throw new Error(`Cloudflare AI Gateway request failed: ${response.statusText}`);
  }

  if (stream) return response;

  const jsonResponse = await response.json();
  if ((jsonResponse as any).result) {
    return new Response(JSON.stringify({ result: (jsonResponse as any).result }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  }

  return new Response(JSON.stringify(jsonResponse), {
    headers: { 'Content-Type': 'application/json' },
    status: response.status,
  });
}
