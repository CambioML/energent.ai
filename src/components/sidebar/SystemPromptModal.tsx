"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AgentAPI } from "@/lib/api/agent-api";
import { useAgentStore } from "@/lib/store/useAgentStore";

interface SystemPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemPromptModal = ({
  isOpen,
  onClose,
}: SystemPromptModalProps) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { systemPrompt, setSystemPrompt, isSystemPromptLoading } = useAgentStore();

  const handleSave = async () => {
    if (!systemPrompt.trim()) {
      toast.error("System prompt cannot be empty");
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading("Saving system prompt...");

    try {
      // Call the API to save the system prompt
      await AgentAPI.updateSystemPrompt(systemPrompt.trim());
      toast.success("System prompt saved successfully", { id: loadingToast });
      onClose();
    } catch (error) {
      console.error("Error saving system prompt:", error);
      toast.error("Failed to save system prompt", { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings size={18} className="" />
            System Prompt Customization
          </DialogTitle>
          <DialogDescription>
            Customize the system prompt to define how the AI assistant behaves.
            Changes will apply to all new conversations.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            placeholder={isSystemPromptLoading ? "Loading system prompt..." : "Enter your custom system prompt..."}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
            disabled={isSystemPromptLoading}
          />
          {isSystemPromptLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <Loading size="sm" />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving || isSystemPromptLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || isSystemPromptLoading}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 