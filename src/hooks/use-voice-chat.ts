
'use client';

/**
 * @fileoverview Custom hook to manage the entire voice chat lifecycle.
 * It integrates audio processing, AI interactions (STT, persona, TTS),
 * and state management.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAudioProcessor } from './use-audio-processor';
import { useAgentStore } from './use-agent-store';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import type { Message } from '@/ai/flows/personalize-agent-response';
import { runVoiceChatPipeline } from '@/ai/flows/voice-chat-pipeline';

export function useVoiceChat() {
  // State from Zustand store
  const { currentAgent, userSettings, setAudioLevel } = useAgentStore();

  // Local state for managing chat flow
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isTalking, setIsTalking] = useState(false); // Represents AI talking
  const [isRecording, setIsRecording] = useState(false);
  const [history, setHistory] = useState<Message[]>([]);
  
  // Refs for managing audio
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  const handleAudioData = useCallback(async (dataUri: string) => {
    if (isMuted) return;
  
    setIsTalking(true); // AI starts "thinking"
    try {
      const result = await runVoiceChatPipeline({
        audioDataUri: dataUri,
        personality: currentAgent.personality,
        userName: userSettings.name,
        userInfo: userSettings.info,
        history: history,
      });

      const { transcribedText, response: responseText } = result;
      
      if (!transcribedText.trim()) {
          setIsTalking(false); // Nothing was said, so AI is done "thinking"
          return;
      }
      
      const userMessage: Message = { role: 'user', content: transcribedText };
      
      if (responseText) {
          const modelMessage: Message = { role: 'model', content: responseText };
          setHistory(prev => [...prev, userMessage, modelMessage]);
          const ttsResult = await textToSpeech({ text: responseText, voice: currentAgent.voice });
          if (audioRef.current && ttsResult?.audio) {
              audioRef.current.src = ttsResult.audio;
              audioRef.current.play().catch(e => {
                console.error("Audio playback error:", e);
                setIsTalking(false); // Reset state if playback fails
              });
          } else {
               setIsTalking(false);
          }
      } else {
           setHistory(prev => [...prev, userMessage]);
           setIsTalking(false);
      }
    } catch (error) {
      console.error('Voice chat pipeline error:', error);
      setIsTalking(false);
    }
  }, [isMuted, currentAgent, userSettings, history]);
  

  const { start, stop } = useAudioProcessor(handleAudioData);

  const connect = useCallback(() => {
    if (!audioRef.current) {
        const audio = new Audio();
        audioRef.current = audio;
        
        audio.onended = () => setIsTalking(false);

        try {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = context.createAnalyser();
            // Check if source node already exists before creating a new one
            if (audioRef.current && !sourceNodeRef.current) {
                const source = context.createMediaElementSource(audioRef.current);
                sourceNodeRef.current = source;
                source.connect(analyser);
            }
            analyser.connect(context.destination);
            
            audioContextRef.current = context;
            analyserRef.current = analyser;
        } catch (e) {
            console.error("Failed to initialize AudioContext:", e);
        }
    }
    setIsConnected(true);
  }, []);


  const disconnect = useCallback(() => {
    if (isRecording) {
      stop();
      setIsRecording(false);
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
    setIsRecording(prev => !prev);
  }, [isRecording, start, stop]);
  
  
  useEffect(() => {
    let lipSyncFrameId: number;
    const analyser = analyserRef.current;
    
    if (isTalking && analyser) {
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
