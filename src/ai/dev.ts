
import { config } from 'dotenv';
config();

// Import your flows here
import '@/ai/flows/tts-flow.ts';
// No longer importing chat-flow as it's a direct server action now.
import '@/ai/flows/expert-chat-flow.ts';
import '@/ai/flows/story-image-flow.ts';
import '@/ai/flows/suggest-new-words.ts';
import '@/ai/flows/translate-flow.ts';


// Voice Chat Agent flows - Keep only the ones we use
// contextualize-ai-persona and personalize-agent-response are no longer needed
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/speech-to-text.ts';
import '@/ai/flows/voice-chat-pipeline.ts';
