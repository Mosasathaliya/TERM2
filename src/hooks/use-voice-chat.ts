
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
import { speechToText } from '@/ai/flows/speech-to-text';


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
  
    setIsTalking(true);
    try {
      // First, get the transcription of the user's audio
      const { text: transcribedText } = await speechToText({ audio: dataUri });
  
      if (!transcribedText || !transcribedText.trim()) {
        setIsTalking(false);
        return; // Nothing was said, so don't proceed
      }
  
      // Add the user's transcribed message to the history
      const userMessage: Message = { role: 'user', content: transcribedText };
      const updatedHistory = [...history, userMessage];
      setHistory(updatedHistory);
  
      // Now, call the pipeline with the complete history to get the AI's response
      const responseResult = await runVoiceChatPipeline({
        audioDataUri: dataUri, // The pipeline still needs this, but we handle history here now.
        personality: currentAgent.personality,
        userName: userSettings.name,
        userInfo: userSettings.info,
        history: updatedHistory, // Send the most up-to-date history
      });
  
      const responseText = responseResult.response;
  
      if (!responseText) {
        setIsTalking(false);
        return;
      }
      
      const modelMessage: Message = { role: 'model', content: responseText };
      setHistory(prev => [...prev, modelMessage]);
  
      const { audio: audioDataUriResponse } = await textToSpeech({ text: responseText, voice: currentAgent.voice });
      
      if (audioRef.current) {
        audioRef.current.src = audioDataUriResponse;
        await audioRef.current.play();
      } else {
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
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const handlePlaybackEnd = () => setIsTalking(false);

    if (isTalking) {
      audioEl.addEventListener('ended', handlePlaybackEnd);
    }

    return () => {
      audioEl.removeEventListener('ended', handlePlaybackEnd);
    };
  }, [isTalking]); 
  
  useEffect(() => {
    const audioEl = audioRef.current;
    const audioCtx = audioContextRef.current;

    if (isTalking && audioEl && !audioCtx) {
      try {
        const newAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = newAudioContext;
        
        if (!sourceNodeRef.current) {
          const source = newAudioContext.createMediaElementSource(audioEl);
          sourceNodeRef.current = source;
          const analyser = newAudioContext.createAnalyser();
          analyserRef.current = analyser;
          source.connect(analyser);
          analyser.connect(newAudioContext.destination);
        }
      } catch (e) {
        console.error("Error setting up AudioContext:", e);
      }
    }

    let lipSyncFrameId: number;
    const analyser = analyserRef.current;
    
    if (isTalking && analyser) {
        analyser.fftSize = 32;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const animate = () => {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
          setAudioLevel(average / 128);
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
