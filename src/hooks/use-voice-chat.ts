
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

// Simple VAD (Voice Activity Detection) parameters
const VAD_SILENCE_TIMEOUT = 1200; // ms of silence before stopping recording
const VAD_SPEECH_TIMEOUT = 30000; // max speech duration in ms
const VAD_THRESHOLD = 0.1; // sensitivity to start detecting speech

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
      if (!transcribedText.trim()) {
        // If transcription is empty, just restart listening
        if (isConnected) startRecording();
        return;
      }

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
      if (isConnected) startRecording(); // Restart recording on error
    }
  }, [isMuted, isTalking, currentAgent, userSettings, history, isConnected]);

  // Initialize the audio processor hook
  const { isRecording, start: startRecording, stop: stopRecording } = useAudioProcessor(handleAudioData);

  // Effect to manage VAD (Voice Activity Detection) logic
  useEffect(() => {
    if (!isConnected || isTalking) return;

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (isSpeaking) {
      // User is speaking, do nothing with the timer.
    } else if (isRecording) {
      // User is not speaking, but we are recording. Start a silence timer.
      silenceTimerRef.current = setTimeout(() => {
        // If silence persists, stop recording to process audio
        stopRecording();
      }, VAD_SILENCE_TIMEOUT);
    }

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, [isSpeaking, isRecording, isConnected, isTalking, stopRecording]);


  // Connect and start the voice chat
  const connect = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      // When AI finishes talking, allow user to speak again by restarting recording
      audioRef.current.onended = () => {
        setIsTalking(false);
        if (isConnected) startRecording();
      };
    }
    startRecording();
    setIsConnected(true);
  }, [startRecording, isConnected]);

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

  // Effect to manage audio analysis for lip-syncing & VAD `isSpeaking` state
  useEffect(() => {
    if (!audioRef.current || !isTalking) {
      setAudioLevel(0);
    }
    
    // VAD logic for user speaking
    let vadFrameId: number;
    let stream: MediaStream | null = null;
    if (isRecording) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      let analyser: AnalyserNode | null = null;
      let microphone: MediaStreamAudioSourceNode | null = null;

      navigator.mediaDevices.getUserMedia({ audio: true }).then(micStream => {
        stream = micStream;
        microphone = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        microphone.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const detectSpeech = () => {
          if (!analyser) return;
          analyser.getByteTimeDomainData(dataArray);
          const volume = dataArray.reduce((sum, value) => sum + Math.abs(value - 128), 0) / dataArray.length;
          
          if (volume > VAD_THRESHOLD) {
            setIsSpeaking(true);
          } else {
            setIsSpeaking(false);
          }
          vadFrameId = requestAnimationFrame(detectSpeech);
        };
        detectSpeech();

      }).catch(err => {
        console.error("Mic access error for VAD:", err);
      });

      return () => {
        cancelAnimationFrame(vadFrameId);
        stream?.getTracks().forEach(track => track.stop());
        microphone?.disconnect();
        analyser?.disconnect();
        audioContext.close();
      }
    }


    // Lip-sync logic for AI speaking
    let lipSyncFrameId: number;
    if (isTalking && audioRef.current) {
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
        audioContext.close();
      };
    }
  }, [isRecording, isTalking, setAudioLevel]);

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
