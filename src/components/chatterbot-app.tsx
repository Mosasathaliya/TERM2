'use client';

/**
 * @fileoverview Main component for the Chatterbot voice agent application.
 * This component orchestrates the agent's appearance, controls, and interaction logic.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { AgentAvatar } from '@/components/chatterbot/agent-avatar';
import { VoiceControls } from '@/components/chatterbot/voice-controls';
import { AgentEditDialog } from '@/components/chatterbot/agent-edit-dialog';
import { UserSettingsDialog } from '@/components/chatterbot/user-settings-dialog';
import { useAgentStore } from '@/hooks/use-agent-store';
import { useUserTasks } from '@/hooks/use-user-tasks';

export function ChatterbotApp() {
  const { currentAgent } = useAgentStore();
  const { backgroundColor } = currentAgent;
  const tasks = useUserTasks();

  // Hook into global audio element (created in use-voice-chat) is complex; as a simple path,
  // we listen to document-level audio play events and sum their durations when ended.
  React.useEffect(() => {
    const onEnded = (e: Event) => {
      const el = e.target as HTMLAudioElement;
      if (el && el.duration && isFinite(el.duration)) {
        tasks.addChatterbotMs(Math.max(0, Math.floor(el.duration * 1000)));
      }
    };
    document.addEventListener('ended', onEnded, true);
    return () => document.removeEventListener('ended', onEnded, true);
  }, [tasks]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0 -z-10" animate={{ backgroundColor }} transition={{ duration: 0.5 }} />
      <header className="absolute top-0 flex w-full justify-between p-4 z-20">
        <AgentEditDialog />
        <UserSettingsDialog />
      </header>
      <main className="flex flex-grow flex-col items-center justify-center">
        <AgentAvatar />
      </main>
      <footer className="w-full p-4">
        <VoiceControls />
      </footer>
    </div>
  );
}
