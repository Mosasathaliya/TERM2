
'use client';

/**
 * @fileoverview Custom hook to manage the entire voice chat lifecycle.
 * It integrates audio processing and calls a server-side pipeline for AI interactions.
 */

import { useRef, useState, useCallback } from "react";
import { runVoiceChatPipeline, type Message as VoiceMessage } from "@/ai/flows/voice-chat-pipeline";
import { textToSpeech } from "@/ai/flows/tts-flow";

export function useVoiceChat() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [history, setHistory] = useState<VoiceMessage[]>([]);

  const speak = useCallback(async (text: string, lang: 'en' | 'ar') => {
    if (!text?.trim()) return;

    if (lang === 'ar' && typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      return;
    }

    const result = await textToSpeech({ prompt: text, lang: 'en' });
    if (!result?.media) return;
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(result.media);
    audioRef.current = audio;
    setIsSpeaking(true);
    audio.onended = () => setIsSpeaking(false);
    await audio.play();
  }, []);

  const send = useCallback(async (audioDataUri: string, personality: string, userName?: string) => {
    const output = await runVoiceChatPipeline({ audioDataUri, personality, userName, history });
    const isArabic = /[\u0600-\u06FF]/.test(output.response);
    await speak(output.response, isArabic ? 'ar' : 'en');
    setHistory(prev => [...prev, { role: 'user', content: output.transcribedText ?? '' }, { role: 'model', content: output.response }]);
    return output;
  }, [history, speak]);

  return { send, isSpeaking };
}
