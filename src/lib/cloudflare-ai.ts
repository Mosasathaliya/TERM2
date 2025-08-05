
'use server';

const CLOUDFLARE_AI_GATEWAY_URL = process.env.CLOUDFLARE_AI_GATEWAY_URL;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

if (!CLOUDFLARE_AI_GATEWAY_URL || !CLOUDFLARE_API_TOKEN) {
  throw new Error("Cloudflare AI Gateway URL or API Token are not set in the environment variables.");
}

type AiModel = 
  | '@cf/meta/llama-3-8b-instruct'
  | '@cf/meta/m2m100-1.2b'
  | '@cf/baai/bge-reranker-base'
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
  const isImageOrAudio = model.includes('stable-diffusion') || model.includes('melotts') || model.includes('whisper');
  const isTextGeneration = model.includes('llama');

  // For models that return binary data, we need a different approach than the gateway.
  // We will call them directly. This is a common pattern when using a gateway.
  if (isImageOrAudio) {
      const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
      if (!CLOUDFLARE_ACCOUNT_ID) {
          throw new Error("Cloudflare Account ID is required for direct model calls.");
      }
      const directUrl = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${model}`;
      
      let body: any;
      const headers: HeadersInit = { 'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`};

      // Whisper model expects raw audio data, not JSON
      if (model.includes('whisper') && 'audio' in inputs && (inputs.audio instanceof Buffer || inputs.audio instanceof Uint8Array)) {
          headers['Content-Type'] = 'application/octet-stream';
          body = inputs.audio; // Assuming inputs.audio is a Buffer
      } else {
          headers['Content-Type'] = 'application/json';
          body = JSON.stringify(inputs);
      }
      
      const response = await fetch(directUrl, {
        method: 'POST',
        headers: headers,
        body: body,
      });

       if (!response.ok) {
        const errorText = await response.text();
        console.error(`Cloudflare AI Direct API error for model ${model}:`, errorText);
        throw new Error(`Cloudflare AI Direct API request failed: ${response.statusText}`);
      }

      return response;
  }
  
  // For other models, use the AI Gateway
  const body = {
      ...(isTextGeneration && stream ? {stream: true} : {}),
      ...inputs
  };

  const gatewayPayload = {
      provider: "workers-ai",
      endpoint: model,
      query: body,
      headers: { // The Authorization header goes inside the payload
          "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`
      }
  };
  
  const response = await fetch(CLOUDFLARE_AI_GATEWAY_URL, {
    method: 'POST',
    headers: { 
        "Content-Type": "application/json",
        "x-gateway-mode": "single" 
    },
    body: JSON.stringify(gatewayPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Cloudflare AI Gateway error for model ${model}:`, errorText);
    throw new Error(`Cloudflare AI Gateway request failed: ${response.statusText}`);
  }

  // The gateway wraps the response. We need to handle this.
  // For streamed text, the gateway response is NOT wrapped.
  if (stream) {
      return response;
  }

  // For non-streamed responses, we need to unwrap the result.
  const jsonResponse = await response.json();
  if (jsonResponse.result) {
      // Re-create a Response object with the unwrapped result to maintain consistency.
      return new Response(JSON.stringify({ result: jsonResponse.result }), {
          headers: {'Content-Type': 'application/json'},
          status: 200
      });
  }

  // Fallback for unexpected structures
  return new Response(JSON.stringify(jsonResponse), {
    headers: {'Content-Type': 'application/json'},
    status: response.status
  });
}
