"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send } from 'lucide-react';
import { useChatStore } from '@/lib/store/useChatStore';
import { Messages } from './Messages';
import { useQuery } from '@tanstack/react-query';
import { useAgentStore } from '@/lib/store/useAgentStore';
import { AgentAPI } from '@/lib/api/agent-api';
import toast from 'react-hot-toast';

export default function Chat() {
  const [inputValue, setInputValue] = useState('');
  const { currentConversationId, sendMessage, fetchConversations, createConversation } = useChatStore();
  const { projectId, agentId, setIsRecordingVideo } = useAgentStore();

  // Initialize conversation if needed with useQuery
  useQuery({
    queryKey: ['initializeChat', projectId, agentId],
    queryFn: async () => {
      try {
        if (!currentConversationId) {
          const conversations = await fetchConversations();
          
          // Only create a new conversation if there are no conversations at all
          if (Array.isArray(conversations) && conversations.length === 0) {
            await createConversation("New Chat");
          }
        }
        return true;
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        toast.error("Failed to initialize chat");
        throw error;
      }
    },
    enabled: !!projectId && !!agentId && !currentConversationId
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    if (!currentConversationId) {
      toast.error('No active conversation');
      return;
    }

    // Clear input
    const message = inputValue.trim();
    setInputValue('');
    
    // Send message to API
    await sendMessage(message);
    
    // Start video recording
    if (agentId && currentConversationId) {
      try {
        const result = await AgentAPI.startVideoRecording(agentId, currentConversationId);
        if (result.success) {
          setIsRecordingVideo(true);
        }
      } catch (error) {
        console.error("Failed to start video recording:", error);
      }
    }
    
    // TODO: Where we stopVideoRecording, backend or frontend?
    // Options:
    // 1. Backend automatically stops after a timeout or when the agent is done
    // 2. Frontend stops after receiving agent response
    // 3. Frontend stops when user sends a new message
    // 4. Frontend stops when user leaves the page
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="h-full w-full flex flex-col rounded-lg border overflow-hidden"
    >
      <div className="flex-1 overflow-hidden">
        <Messages />
      </div>
      
      {/* Input box */}
      <div className="border-t border-border/50 py-3 px-4 bg-background/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-muted/50 focus:bg-muted/80 rounded-lg py-2.5 px-4 border-0 outline-none text-sm font-normal text-foreground/70 focus:text-foreground placeholder:text-foreground/40 placeholder:font-light placeholder:text-xs transition-colors"
          />
          
          <button 
            type="submit" 
            disabled={!inputValue.trim()}
            aria-label="Send message"
            className="p-3 rounded-md bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </motion.div>
  );
} 