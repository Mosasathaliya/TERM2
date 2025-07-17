
import { config } from 'dotenv';
config();

// Import your flows here
import '@/ai/flows/tts-flow.ts';
// No longer importing chat-flow as it's a direct server action now.
import '@/ai/flows/expert-chat-flow.ts';
import '@/ai/flows/story-image-flow.ts';
import '@/ai/flows/suggest-new-words.ts';
import '@/ai/flows/translate-flow.ts';
import '@/ai/flows/explain-video-flow.ts';
import '@/ai/flows/generate-certificate-image.ts';
import '@/ai/flows/generate-quiz-flow.ts';
import '@/ai/flows/generate-vocabulary-quiz.ts';
import '@/ai/flows/story-quiz-flow.ts';


// Voice Chat Agent flows
// No longer need text-to-speech here, it's covered by the main tts-flow
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
