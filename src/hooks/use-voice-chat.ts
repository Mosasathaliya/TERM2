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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTalking, setIsTalking] = useState(false); // When AI is processing and speaking
  const [history, setHistory] = useState<Message[]>([]);

  // Refs for managing audio and timeouts
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Callback to handle transcribed audio data
  const handleAudioData = useCallback(async (dataUri: string) => {
    // If muted or AI is already talking, do nothing
    if (isMuted || isTalking) return;

    try {
      // 1. Convert speech to text
      const { text: transcribedText } = await speechToText({ audio: dataUri });
      if (!transcribedText.trim()) return; // Ignore empty transcriptions

      setIsSpeaking(false);
      setIsTalking(true);
      setHistory((prev) => [...prev, { role: 'user', content: transcribedText }]);

      // 2. Get the agent's persona
      const { contextualizedPersona } = await contextualizeAIPersona({
        personality: currentAgent.personality,
        userName: userSettings.name,
        userInfo: userSettings.info,
      });

      // 3. Get the personalized response from the agent
      const { response } = await personalizeAgentResponse({
        contextualizedPersona,
        history,
        prompt: transcribedText,
      });
      setHistory((prev) => [...prev, { role: 'model', content: response }]);

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
  }, [isMuted, isTalking, currentAgent, userSettings, history]);

  // Initialize the audio processor hook
  const { isRecording, start: startRecording, stop: stopRecording } = useAudioProcessor(handleAudioData);

  // Callback for when the user starts speaking
  const handleSpeechStart = useCallback(() => {
    setIsSpeaking(true);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
  }, []);

  // Callback for when the user stops speaking
  const handleSpeechEnd = useCallback(() => {
    // Start a timer. If there's silence for 1 second, stop recording.
    silenceTimerRef.current = setTimeout(() => {
      if (isRecording) {
        stopRecording();
      }
      setIsSpeaking(false);
    }, 1000);
  }, [isRecording, stopRecording]);

  // Connect and start the voice chat
  const connect = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      // When AI finishes talking, allow user to speak again
      audioRef.current.onended = () => setIsTalking(false);
    }
    startRecording();
    setIsConnected(true);
  }, [startRecording]);

  // Disconnect and stop the voice chat
  const disconnect = useCallback(() => {
    stopRecording();
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsConnected(false);
    setIsSpeaking(false);
    setIsTalking(false);
    setHistory([]); // Reset history on disconnect
  }, [stopRecording]);

  const toggleMute = () => setIsMuted((prev) => !prev);

  // Effect to manage audio analysis for lip-syncing
  useEffect(() => {
    if (!audioRef.current || !isTalking) {
      setAudioLevel(0);
      return;
    }

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 32;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let animationFrameId: number;
    const animate = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
      setAudioLevel(average / 128); // Normalize to a 0-1 range
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      source.disconnect();
      analyser.disconnect();
    };
  }, [isTalking, setAudioLevel]);

  // This is a placeholder for a more robust VAD (Voice Activity Detection)
  // For now, we simulate it with simple timeouts
  useEffect(() => {
    if (isRecording) {
      // In a real implementation, a VAD library would trigger these
      // For now, we use the isSpeaking state as a proxy
      if (isSpeaking) {
        handleSpeechStart();
      } else {
        handleSpeechEnd();
      }
    }
  }, [isSpeaking, isRecording, handleSpeechStart, handleSpeechEnd]);

  return {
    isConnected,
    isMuted,
    isSpeaking,
    isTalking,
    connect,
    disconnect,
    toggleMute,
  };
}
