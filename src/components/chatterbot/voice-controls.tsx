
'use client';

/**
 * @fileoverview Component for the voice chat controls (connect, disconnect, mute, unmute).
 * It reflects the current state of the voice chat connection.
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { useVoiceChat } from '@/hooks/use-voice-chat';
import { Mic, MicOff, Phone, PhoneOff, Send } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function VoiceControls() {
  const {
    isConnected,
    isMuted,
    isRecording,
    isTalking,
    connect,
    disconnect,
    toggleMute,
    startRecording,
    stopRecording,
  } = useVoiceChat();

  const getStatusText = () => {
    if (!isConnected) return 'Disconnected';
    if (isRecording) return 'Recording...';
    if (isTalking) return 'Thinking...';
    return 'Connected';
  };
  
  const handleRecordPress = () => {
    if (isConnected && !isTalking) {
      startRecording();
    }
  };

  const handleRecordRelease = () => {
    if (isRecording) {
      stopRecording();
    }
  };


  return (
    <div className="flex flex-col items-center gap-4">
      {/* Animated status text */}
      <div className="relative h-6 w-32 text-center">
        <AnimatePresence>
          <motion.p
            key={getStatusText()}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 text-white/80"
          >
            {getStatusText()}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Control buttons */}
      <div className="flex items-center justify-center gap-4 rounded-full bg-black/30 p-2 backdrop-blur-sm">
        {/* Mute/Unmute Button */}
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-full bg-white/10 text-white hover:bg-white/20"
          onClick={toggleMute}
          disabled={!isConnected}
        >
          {isMuted ? <MicOff /> : <Mic />}
        </Button>

        {/* Connect/Disconnect Button */}
        <Button
          size="icon"
          className={`h-16 w-16 rounded-full text-white transition-colors ${
            isConnected ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
          onClick={isConnected ? disconnect : connect}
        >
          {isConnected ? <PhoneOff /> : <Phone />}
        </Button>
        
        {/* Record/Send Button */}
         <Button
          variant="outline"
          size="icon"
          className={`h-14 w-14 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all ${isRecording ? 'scale-110 bg-blue-500' : ''}`}
          onMouseDown={handleRecordPress}
          onMouseUp={handleRecordRelease}
          onTouchStart={handleRecordPress}
          onTouchEnd={handleRecordRelease}
          disabled={!isConnected || isTalking}
        >
          <Send />
        </Button>
      </div>
    </div>
  );
}
