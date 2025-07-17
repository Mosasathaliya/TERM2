'use client';

/**
 * @fileoverview Dialog component for managing user settings.
 * Allows users to input their name and other info to personalize AI interactions.
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
import { useAgentStore, type UserSettings } from '@/hooks/use-agent-store';
import { User } from 'lucide-react';

export function UserSettingsDialog() {
  const { userSettings, setUserSettings } = useAgentStore();
  const [isOpen, setIsOpen] = useState(false);
  // Local state for form editing
  const [editedSettings, setEditedSettings] = useState<UserSettings>(userSettings);

  // Sync local state if global state changes
  React.useEffect(() => {
    setEditedSettings(userSettings);
  }, [userSettings]);

  const handleSave = () => {
    setUserSettings(editedSettings);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>User Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Settings</DialogTitle>
          <DialogDescription>
            This information helps the AI personalize its responses for you.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* User Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={editedSettings.name}
              onChange={(e) => setEditedSettings({ ...editedSettings, name: e.target.value })}
              className="col-span-3"
              placeholder="E.g., Alex"
            />
          </div>
          {/* User Info */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="info" className="text-right">
              About You
            </Label>
            <Textarea
              id="info"
              value={editedSettings.info}
              onChange={(e) => setEditedSettings({ ...editedSettings, info: e.target.value })}
              className="col-span-3"
              rows={3}
              placeholder="E.g., I'm a software developer from California who loves hiking."
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
