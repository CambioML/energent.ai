import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useChatStore } from "@/lib/store/chat";
import { LoadingDots } from "@/components/ui/loading-dots";
import { MessageItem } from "./MessageItem";
import toast from "react-hot-toast";
import { MessageSquare, Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAgentStore } from "@/lib/store/agent";

export function Messages() {
  const [userScrolled, setUserScrolled] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Global state from stores
  const { 
    isTyping,
    currentConversationId,
    messages, 
    fetchConversation, 
    fetchConversations,
    createConversation,
    sendFeedback,
    messagesLoaded
  } = useChatStore();
  
  const { projectId, agentId } = useAgentStore();
  
  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (!userScrolled) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages?.at(-1)?.timestamp, isTyping]);

  // Detect if user has scrolled up
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isScrolledToBottom = scrollHeight - scrollTop - clientHeight < 10;
      setUserScrolled(!isScrolledToBottom);
    }
  };
  
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

  // Fetch conversation messages with useQuery
  useQuery({
    queryKey: ['fetchConversation', currentConversationId],
    queryFn: () => fetchConversation(currentConversationId!),
    enabled: !!currentConversationId
  });
  
  const handleMessageFeedback = async (messageId: string, feedback: 'good' | 'bad') => {
    if (!currentConversationId) return;
    
    try {
      const loadingToast = toast.loading(`Sending feedback...`);
      await sendFeedback(messageId, feedback);
      toast.success(`Feedback sent!`, { id: loadingToast });
    } catch (error) {
      console.error("Error sending feedback:", error);
      toast.error("Failed to send feedback");
    }
  };

  // Loading state content
  const renderLoadingState = () => (
    <div className="flex-1 overflow-y-auto p-4 h-full flex items-center justify-center">
      <motion.div
        key="loading-state"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8"
      >
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">Loading Conversation...</h3>
        <p className="text-muted-foreground pb-2">
          Fetching your messages
        </p>
        <LoadingDots className="justify-center" />
      </motion.div>
    </div>
  );

  // Empty state content
  const renderEmptyState = () => (
    <div className="flex-1 overflow-y-auto p-4 h-full flex items-center justify-center">
      <motion.div
        key="empty-state"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8"
      >
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No Messages Yet</h3>
        <p className="text-muted-foreground mb-4">
          Start a conversation by typing a message below
        </p>
        <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
          <Send className="h-4 w-4" />
          <span>Type a message to begin</span>
        </div>
      </motion.div>
    </div>
  );

  // Messages content
  const renderMessages = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-2 h-full"
      onScroll={handleScroll}
    >
      {messages.map((message) => (
        <MessageItem 
          key={message.id} 
          message={message} 
          onFeedback={handleMessageFeedback}
        />
      ))}
      
      {isTyping && (
        <div className="flex items-start gap-2.5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2.5"
          >
            <div className="p-2 rounded-lg bg-muted text-foreground rounded-tl-none">
              <LoadingDots />
            </div>
          </motion.div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      {messagesLoaded ? (
        messages.length > 0 ? renderMessages() : 
        renderEmptyState()
      ) : (
        renderLoadingState()
      )}
    </AnimatePresence>
  );
} 