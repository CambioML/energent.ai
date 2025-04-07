"use client";

import { motion } from 'framer-motion';
import { useChatStore } from '@/lib/store/useChatStore';
import { Messages } from './Messages';
import { useQuery } from '@tanstack/react-query';
import { useAgentStore } from '@/lib/store/useAgentStore';
import InputBox from './InputBox';
import toast from 'react-hot-toast';

export default function Chat() {
  const { currentConversationId, fetchConversations, createConversation, messagesLoaded, messages } = useChatStore();
  const { projectId, agentId } = useAgentStore();

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.0 }}
      className="h-full w-full flex flex-col rounded-lg border overflow-hidden"
    >
      <div className="flex-1 overflow-hidden">
        <Messages />
      </div>
      
      {messagesLoaded && messages.length > 0 && <InputBox />}
    </motion.div>
  );
} 