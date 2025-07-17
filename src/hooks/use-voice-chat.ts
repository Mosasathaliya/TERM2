
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
  const [isTalking, setIsTalking] = useState(false); // When AI is processing and speaking
  const [history, setHistory] = useState<Message[]>([]);
  
  // Refs for managing audio
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Callback to handle transcribed audio data
  const handleAudioData = useCallback(async (dataUri: string) => {
    // If muted or AI is already talking, do nothing
    if (isMuted || isTalking) return;

    try {
      // 1. Convert speech to text
      setIsTalking(true); // AI processing starts now
      const { text: transcribedText } = await speechToText({ audio: dataUri });
      if (!transcribedText.trim()) {
        setIsTalking(false);
        return;
      }

      const userMessage: Message = { role: 'user', content: transcribedText };
      // Use functional update to get the latest history
      setHistory(prevHistory => [...prevHistory, userMessage]);

      // 2. Get the agent's persona
      const { contextualizedPersona } = await contextualizeAIPersona({
        personality: currentAgent.personality,
        userName: userSettings.name,
        userInfo: userSettings.info,
      });

      // 3. Get the personalized response from the agent
      // Use the latest history for the API call
      const { response } = await personalizeAgentResponse({
        contextualizedPersona,
        history: [...history, userMessage],
        prompt: transcribedText,
      });

      const modelMessage: Message = { role: 'model', content: response };
      setHistory((prev) => [...prev, modelMessage]);

      // 4. Convert the agent's response to speech
      const { audio: audioDataUri } = await textToSpeech({ text: response, voice: currentAgent.voice });
      
      // 5. Play the audio
      if (audioRef.current) {
        audioRef.current.src = audioDataUri;
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Voice chat pipeline error:', error);
      setIsTalking(false);
    }
  }, [isMuted, isTalking, currentAgent, userSettings, history]); // Added history to dependencies

  // Initialize the audio processor hook
  const { isRecording, start, stop } = useAudioProcessor(handleAudioData);

  // Connect and start the voice chat
  const connect = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      // When AI finishes talking, set talking state to false
      audioRef.current.onended = () => {
        setIsTalking(false);
      };
    }
    setIsConnected(true);
  }, []);

  // Disconnect and stop the voice chat
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
    setHistory([]); // Reset history on disconnect
  }, [isRecording, stop]);

  const toggleMute = () => setIsMuted((prev) => !prev);
  
  // Effect to manage audio analysis for lip-syncing
  useEffect(() => {
    if (!audioRef.current || !isTalking) {
      setAudioLevel(0);
      return;
    }
    
    let lipSyncFrameId: number;
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 32;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const animate = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
      setAudioLevel(average / 128); // Normalize to a 0-1 range
      lipSyncFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(lipSyncFrameId);
      source.disconnect();
      analyser.disconnect();
      audioContext.close().catch(console.error);
    };
  }, [isTalking, setAudioLevel]);

  return {
    isConnected,
    isMuted,
    isRecording, // Expose recording state
    isTalking,
    connect,
    disconnect,
    toggleMute,
    startRecording: start, // Expose start recording function
    stopRecording: stop,  // Expose stop recording function
  };
}
