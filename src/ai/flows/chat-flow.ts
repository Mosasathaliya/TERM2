
'use server';
/**
 * @fileOverview A simple server action for streaming conversational AI responses using the Hugging Face Inference API.
 */

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct";

/**
 * A streamable server action that takes a user's question and returns a stream of the AI's response from Hugging Face.
 * @param question The user's question as a string.
 * @returns A ReadableStream of the AI's response text.
 */
export async function chatStream(question: string): Promise<ReadableStream<Uint8Array>> {
    if (!HUGGING_FACE_API_KEY) {
        throw new Error("Hugging Face API key is not configured.");
    }
    
    const systemPrompt =
      "You are an AI assistant from Speed of Mastery, a company dedicated to helping users learn English. If asked who you are, you must identify yourself as an AI model from Speed of Mastery. You are a friendly and helpful English language learning assistant. Answer the user's questions clearly and concisely. Keep your answers in Arabic unless the user asks for something in English.";

    const huggingFacePayload = {
        inputs: `<|system|>\n${systemPrompt}<|end|>\n<|user|>\n${question}<|end|>\n<|assistant|>`,
        parameters: {
            max_new_tokens: 512,
            return_full_text: false,
        },
    };

    const response = await fetch(MODEL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(huggingFacePayload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Hugging Face API error:", errorText);
        throw new Error(`Hugging Face API request failed: ${response.statusText}`);
    }

    // Hugging Face inference for text generation doesn't stream token by token in the same way.
    // This will return the full response at once. We'll wrap it in a stream for consistency.
    const result = await response.json();
    const responseText = result[0]?.generated_text || "Sorry, I couldn't generate a response.";

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
        start(controller) {
            controller.enqueue(encoder.encode(responseText));
            controller.close();
        },
    });

    return readableStream;
}
