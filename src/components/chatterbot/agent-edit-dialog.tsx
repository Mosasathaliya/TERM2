
'use client';

/**
 * @fileoverview Dialog component for editing AI agent properties.
 * Allows users to change the agent's name, personality, voice, and color.
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAgentStore, type Agent } from '@/hooks/use-agent-store';
import { Pencil } from 'lucide-react';

const PREBUILT_VOICES = [
  'algenib', 'antares', 'sirius', 'alnilam', 'gacrux',
  'achernar', 'achird', 'algieba', 'rasalgethi', 'schedar', 'vindemiatrix'
] as const;

export function AgentEditDialog() {
  const { currentAgent, setCurrentAgent } = useAgentStore();
  const [isOpen, setIsOpen] = useState(false);
  // Local state to manage form edits without updating the global state until save
  const [editedAgent, setEditedAgent] = useState<Agent>(currentAgent);

  // Update local state when the global agent changes (e.g., from a dropdown)
  React.useEffect(() => {
    setEditedAgent(currentAgent);
  }, [currentAgent]);

  const handleSave = () => {
    setCurrentAgent(editedAgent);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Pencil className="h-4 w-4" />
          <span>Edit Agent</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Agent</DialogTitle>
          <DialogDescription>
            Modify your AI agent's details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Agent Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={editedAgent.name}
              onChange={(e) => setEditedAgent({ ...editedAgent, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          {/* Agent Personality */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="personality" className="text-right">
              Personality
            </Label>
            <Textarea
              id="personality"
              value={editedAgent.personality}
              onChange={(e) => setEditedAgent({ ...editedAgent, personality: e.target.value })}
              className="col-span-3"
              rows={3}
            />
          </div>
          {/* Agent Voice */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="voice" className="text-right">
              Voice
            </Label>
            <Select
              value={editedAgent.voice}
              onValueChange={(value) =>
                setEditedAgent({ ...editedAgent, voice: value as Agent['voice'] })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {PREBUILT_VOICES.map((voice) => (
                  <SelectItem key={voice} value={voice}>
                    {voice}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Agent Color */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">
              Color
            </Label>
            <Input
              id="color"
              type="color"
              value={editedAgent.bodyColor}
              onChange={(e) => setEditedAgent({ ...editedAgent, bodyColor: e.target.value })}
              className="col-span-3 p-1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
