
'use client';

/**
 * @fileoverview Custom hook to manage the entire voice chat lifecycle for Chatterbot.
 * - STT: Records mic audio, sends to Cloudflare Whisper via server pipeline
 * - LLM: Generates response via Cloudflare text model (runAi)
 * - TTS: Speaks back (browser SpeechSynthesis for Arabic, Cloudflare TTS for English)
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import { useAudioProcessor } from './use-audio-processor';
import { useAgentStore } from './use-agent-store';
import { textToSpeech } from '@/ai/flows/tts-flow';
import { runVoiceChatPipeline, type Message as VoiceMessage } from '@/ai/flows/voice-chat-pipeline';

const MAX_HISTORY_MESSAGES = 30; // keep last 15 user/model pairs

export function useVoiceChat() {
  const { currentAgent, userSettings, setAudioLevel } = useAgentStore();

  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [history, setHistory] = useState<VoiceMessage[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  const speak = useCallback(async (text: string) => {
    if (!text?.trim() || isMuted) return;

    const isArabic = /[\u0600-\u06FF]/.test(text);
    setIsTalking(true);

    if (isArabic && typeof window !== 'undefined' && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ar-SA';
      u.onend = () => setIsTalking(false);
      window.speechSynthesis.speak(u);
      return;
    }

    const result = await textToSpeech({ prompt: text, lang: 'en' });
    if (!result?.media) {
      setIsTalking(false);
      return;
    }

    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.src = result.media;
    audioRef.current.onended = () => setIsTalking(false);
    try {
      await audioRef.current.play();
    } catch {
      setIsTalking(false);
    }
  }, [isMuted]);

  const handleAudioData = useCallback(async (dataUri: string) => {
    try {
      const output = await runVoiceChatPipeline({
        audioDataUri: dataUri,
        personality: currentAgent.personality,
        userName: userSettings.name,
        userInfo: userSettings.info,
        history,
      });

      if (output.transcribedText) {
        const userMsg: VoiceMessage = { role: 'user', content: output.transcribedText };
        setHistory((prev) => [...prev, userMsg].slice(-MAX_HISTORY_MESSAGES));
      }

      if (output.response) {
        const modelMsg: VoiceMessage = { role: 'model', content: output.response };
        setHistory((prev) => [...prev, modelMsg].slice(-MAX_HISTORY_MESSAGES));
        await speak(output.response);
      }
    } catch (error) {
      console.error('Voice chat pipeline error:', error);
      setIsTalking(false);
    }
  }, [currentAgent.personality, userSettings.name, userSettings.info, history, speak]);

  const { isRecording, start, stop } = useAudioProcessor(handleAudioData);

  const connect = useCallback(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    setIsConnected(true);
  }, []);

  const disconnect = useCallback(() => {
    if (isRecording) {
      stop();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      analyserRef.current = null;
      sourceNodeRef.current = null;
    }
    setIsConnected(false);
    setIsTalking(false);
    setHistory([]);
    setAudioLevel(0);
  }, [isRecording, stop, setAudioLevel]);

  const toggleMute = () => setIsMuted((prev) => !prev);

  const toggleRecording = useCallback(() => {
    if (!isConnected) return;
    if (isRecording) stop(); else start();
  }, [isConnected, isRecording, start, stop]);

  // Optional: lip-sync meter (average audio level) when speaking
  useEffect(() => {
    let rafId: number;
    if (!audioRef.current) return;

    const setup = () => {
      if (!audioContextRef.current) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const src = ctx.createMediaElementSource(audioRef.current!);
        const analyser = ctx.createAnalyser();
        src.connect(analyser);
        analyser.connect(ctx.destination);
        audioContextRef.current = ctx;
        analyserRef.current = analyser;
        sourceNodeRef.current = src;
      }
    };

    const animate = () => {
      const analyser = analyserRef.current;
      if (!analyser || !isTalking) {
        setAudioLevel(0);
        rafId && cancelAnimationFrame(rafId);
        return;
      }
      analyser.fftSize = 32;
      const buffer = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(buffer);
      const avg = buffer.reduce((a, v) => a + v, 0) / buffer.length;
      setAudioLevel(avg / 128);
      rafId = requestAnimationFrame(animate);
    };

    if (isTalking) {
      setup();
      animate();
    } else {
      setAudioLevel(0);
    }

    return () => rafId && cancelAnimationFrame(rafId);
  }, [isTalking, setAudioLevel]);

  return {
    isConnected,
    isMuted,
    isRecording,
    isTalking,
    connect,
    disconnect,
    toggleMute,
    toggleRecording,
  };
}
