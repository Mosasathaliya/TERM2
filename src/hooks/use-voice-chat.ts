
'use client';

/**
 * @fileoverview Custom hook to manage the entire voice chat lifecycle.
 * It integrates audio processing, AI interactions (STT, persona, TTS),
 * and state management.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAudioProcessor } from './use-audio-processor';
import { useAgentStore } from './use-agent-store';
import { speechToText } from '@/ai/flows/speech-to-text';
import { contextualizeAIPersona } from '@/ai/flows/contextualize-ai-persona';
import { personalizeAgentResponse, type Message } from '@/ai/flows/personalize-agent-response';
import { textToSpeech } from '@/ai/flows/text-to-speech';

export function useVoiceChat() {
  // State from Zustand store
  const { currentAgent, userSettings, setAudioLevel } = useAgentStore();

  // Local state for managing chat flow
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [history, setHistory] = useState<Message[]>([]);
  
  // Refs for managing audio
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  const handleAudioData = useCallback(async (dataUri: string) => {
    if (isMuted || isTalking) return;

    try {
      setIsTalking(true);
      const { text: transcribedText } = await speechToText({ audio: dataUri });
      if (!transcribedText.trim()) {
        setIsTalking(false);
        return;
      }

      const userMessage: Message = { role: 'user', content: transcribedText };
      const newHistory = [...history, userMessage];
      setHistory(newHistory);
      
      const { contextualizedPersona } = await contextualizeAIPersona({
        personality: currentAgent.personality,
        userName: userSettings.name,
        userInfo: userSettings.info,
      });

      const { response } = await personalizeAgentResponse({
        contextualizedPersona,
        history: newHistory,
        prompt: transcribedText,
      });

      const modelMessage: Message = { role: 'model', content: response };
      setHistory(prev => [...prev, modelMessage]);

      const { audio: audioDataUri } = await textToSpeech({ text: response, voice: currentAgent.voice });
      
      if (audioRef.current) {
        audioRef.current.src = audioDataUri;
        await audioRef.current.play();
      } else {
        // If audio element isn't ready, we can't play, so we're not "talking" anymore.
        setIsTalking(false);
      }
    } catch (error) {
      console.error('Voice chat pipeline error:', error);
      setIsTalking(false);
    }
  }, [isMuted, isTalking, currentAgent, userSettings, history]);

  const { isRecording, start, stop } = useAudioProcessor(handleAudioData);

  const connect = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audioRef.current = audio;
    }
    setIsConnected(true);
  }, []);
  
  // Effect to manage the onended event listener for the audio element.
  // This ensures the listener always has the current `setIsTalking` function.
  useEffect(() => {
    const audioEl = audioRef.current;
    if (audioEl) {
      const handlePlaybackEnd = () => setIsTalking(false);
      audioEl.addEventListener('ended', handlePlaybackEnd);
      return () => {
        audioEl.removeEventListener('ended', handlePlaybackEnd);
      };
    }
  }, [setIsTalking]);


  const disconnect = useCallback(() => {
    if (isRecording) {
      stop();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsConnected(false);
    setIsTalking(false);
    setHistory([]);
    setAudioLevel(0);
  }, [isRecording, stop, setAudioLevel]);

  const toggleMute = () => setIsMuted((prev) => !prev);
  
  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stop();
    } else {
      start();
    }
  }, [isRecording, start, stop]);
  
  useEffect(() => {
    let lipSyncFrameId: number;

    const setupAudioAnalysis = () => {
        if (!audioRef.current) return;
        
        if (!audioContextRef.current) {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = context;
            analyserRef.current = context.createAnalyser();
            try {
                sourceNodeRef.current = context.createMediaElementSource(audioRef.current);
                sourceNodeRef.current.connect(analyserRef.current);
                analyserRef.current.connect(context.destination);
            } catch (e) {
                 if (e instanceof DOMException && e.name === 'InvalidStateError') {
                    // This error means the source node is already connected, which is fine.
                } else {
                    console.error("Error setting up audio source node:", e);
                }
            }
        }
    };

    if (isTalking) {
      setupAudioAnalysis();
      const analyser = analyserRef.current;
      if (analyser) {
        analyser.fftSize = 32;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const animate = () => {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
          setAudioLevel(average / 128); // Normalize the audio level
          lipSyncFrameId = requestAnimationFrame(animate);
        };
        animate();
      }
    } else {
      setAudioLevel(0);
    }

    return () => {
      if (lipSyncFrameId) {
        cancelAnimationFrame(lipSyncFrameId);
      }
    };
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
