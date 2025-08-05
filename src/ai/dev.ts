
import { config } from 'dotenv';
config();

// AI text generation is now handled by direct Cloudflare API calls.
// Genkit is still used for other features like Text-to-Speech (TTS) and Speech-to-Text (STT).

// Keeping a few representative imports to show the structure.
import '@/ai/flows/tts-flow.ts';
import '@/ai/flows/chat-flow.ts';
import '@/ai/flows/expert-chat-flow.ts';
import '@/ai/flows/story-image-flow.ts';
import '@/ai/flows/suggest-new-words.ts';
import '@/ai/flows/translate-flow.ts';
import '@/ai/flows/explain-video-flow.ts';
import '@/ai/flows/generate-certificate-image.ts';
import '@/ai/flows/generate-quiz-flow.ts';
import '@/ai/flows/generate-vocabulary-quiz.ts';
import '@/ai/flows/story-quiz-flow.ts';
import '@/ai/flows/image-generation-flow.ts';
import '@/ai/flows/reranker-flow.ts';


// Voice Chat Agent flows
import '@/ai/flows/voice-chat-pipeline.ts';

// Tense Teacher flows
import '@/ai/flows/ahmed-voice-call.ts';
import '@/ai/flows/sara-voice-call.ts';

// Adventure game flows
import '@/ai/flows/text-adventure-flow.ts';

// Lingo Lessons flows
import '@/ai/flows/exercise-feedback.ts';
import '@/ai/flows/generate-lesson-content.ts';
import '@/ai/flows/lesson-tutor-flow.ts';
