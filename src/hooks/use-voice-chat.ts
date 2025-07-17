
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
import type { Message } from '@/ai/flows/voice-chat-pipeline';
import { runVoiceChatPipeline } from '@/ai/flows/voice-chat-pipeline';

export function useVoiceChat() {
  const { currentAgent, userSettings, setAudioLevel } = useAgentStore();
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [history, setHistory] = useState<Message[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  const handleAudioData = useCallback(async (dataUri: string) => {
    if (isMuted) return;
  
    setIsTalking(true);
    try {
      const pipelineInput = {
        audioDataUri: dataUri,
        personality: currentAgent.personality,
        userName: userSettings.name,
        userInfo: userSettings.info,
        history: history,
      };

      const result = await runVoiceChatPipeline(pipelineInput);
      const { transcribedText, response: responseText } = result;
      
      if (!transcribedText.trim()) {
          setIsTalking(false);
          return;
      }
      
      const userMessage: Message = { role: 'user', content: transcribedText };
      
      if (responseText) {
          const modelMessage: Message = { role: 'model', content: responseText };
          // Update history with both user message and model response for the next turn
          setHistory(prev => [...prev, userMessage, modelMessage]);
          
          const ttsResult = await textToSpeech({ text: responseText, voice: currentAgent.voice });
          if (audioRef.current && ttsResult?.audio) {
              audioRef.current.src = ttsResult.audio;
              audioRef.current.play().catch(e => {
                console.error("Audio playback error:", e);
                setIsTalking(false);
              });
          } else {
               setIsTalking(false);
          }
      } else {
           // If there's no response text, just add the user's message to history
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
    if (isRecording) {
      stop();
    } else {
      start();
    }
    setIsRecording(prev => !prev);
  }, [isRecording, start, stop]);
  
  
  useEffect(() => {
    let lipSyncFrameId: number;

    const setupAudioContext = () => {
        if (audioRef.current && !audioContextRef.current) {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const source = context.createMediaElementSource(audioRef.current);
            const analyser = context.createAnalyser();
            
            source.connect(analyser);
            analyser.connect(context.destination);
            
            audioContextRef.current = context;
            analyserRef.current = analyser;
            sourceNodeRef.current = source;
        }
    };
    
    if (isTalking) {
      setupAudioContext();
      const analyser = analyserRef.current;
      if (analyser) {
        analyser.fftSize = 32;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const animate = () => {
          if (!analyserRef.current || !isTalking) {
            cancelAnimationFrame(lipSyncFrameId);
            setAudioLevel(0);
            return;
          }
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
          setAudioLevel(average / 128);
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

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    
    const handleAudioEnd = () => {
      setIsTalking(false);
    };

    audioEl.addEventListener('ended', handleAudioEnd);
    return () => {
      audioEl.removeEventListener('ended', handleAudioEnd);
    };
  }, [isTalking]); // Rerun this effect if isTalking changes to ensure the handler has the correct scope

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
