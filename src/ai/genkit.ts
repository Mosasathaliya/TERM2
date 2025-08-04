import { genkit, type GenkitErrorCode } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { NextRequest, NextResponse } from 'next/server';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export function genkitNext(flow: any) {
  return async function POST(req: NextRequest) {
    let input;
    try {
      input = await req.json();
    } catch (e) {
      input = undefined;
    }
    const { stream, response } = await flow(
      input,
      // Create a stream to send results back to the client.
      (chunk: any) => {
        // Here, you would send the chunk back to the client.
        // For example, using Server-Sent Events (SSE).
      }
    );

    if (stream) {
      // The output of this run is being streamed.
      const transformStream = new TransformStream({
        transform(chunk, controller) {
          controller.enqueue(
            `data: ${JSON.stringify({ chunk: chunk.output })}\n\n`
          );
        },
      });

      stream.pipeTo(transformStream.writable);
      const response = new NextResponse(transformStream.readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
      });
      return response;
    } else {
      // The output of this run is a single object.
      try {
        const result = await response;
        return NextResponse.json(result);
      } catch (e: any) {
        const err = e as { name: GenkitErrorCode; message: string };
        const response: any = {
          error: {
            code: err.name,
            message: err.message,
          },
        };
        const status = err.name === 'bad-request' ? 400 : 500;
        return NextResponse.json(response, { status });
      }
    }
  };
}
