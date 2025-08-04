
import { config } from 'dotenv';
config();

// We are now using direct Hugging Face API calls in our server actions,
// so we don't need to import and register Genkit flows here in the same way.
// The dev server will still run to enable other potential Genkit features.

// Keeping a few representative imports to show the structure, though they are not all active.
import '@/ai/flows/tts-flow.ts';
import '@/ai/flows/chat-flow.ts'; // This is now a direct server action
import '@/ai/flows/expert-chat-flow.ts';
import '@/ai/flows/story-image-flow.ts'; // This is now a direct server action
import '@/ai/flows/suggest-new-words.ts';
import '@/ai/flows/translate-flow.ts';
import '@/ai/flows/explain-video-flow.ts';
import '@/ai/flows/generate-certificate-image.ts';
import '@/ai/flows/generate-quiz-flow.ts';
import '@/ai/flows/generate-vocabulary-quiz.ts';
import '@/ai/flows/story-quiz-flow.ts';


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
