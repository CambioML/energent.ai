import { MessageItem } from "./MessageItem";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useChatStore } from "@/lib/store/useChatStore";
import { LoadingDots } from "@/components/ui/loading-dots";
import { motion, AnimatePresence } from "framer-motion";
import { useAgentStore } from "@/lib/store/useAgentStore";
import toast from "react-hot-toast";
import EmptyState from "./EmptyState";

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
    sendFeedback,
    messagesLoaded,
    sendMessage
  } = useChatStore();

  const { projectId, agentId } = useAgentStore();
  
  // Scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    if (!userScrolled) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [userScrolled]);

  // Extract the complex expression to a separate variable
  const latestMessageTimestamp = messages?.at(-1)?.timestamp;

  useEffect(() => {
    scrollToBottom();
  }, [latestMessageTimestamp, isTyping, scrollToBottom]);

  // Detect if user has scrolled up
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isScrolledToBottom = scrollHeight - scrollTop - clientHeight < 10;
      setUserScrolled(!isScrolledToBottom);
    }
  };
  
  // Fetch conversation messages with useQuery
  useQuery({
    queryKey: ['fetchConversation', currentConversationId],
    queryFn: () => {
      return fetchConversation(currentConversationId!);
    },
    enabled: !!currentConversationId && !!projectId && !!agentId
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

  const handleExampleClick = async (example: string) => {
    if (!currentConversationId) {
      toast.error('No active conversation');
      return;
    }
    await sendMessage(example);
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
        <EmptyState onExampleClick={handleExampleClick} />
      ) : (
        renderLoadingState()
      )}
    </AnimatePresence>
  );
} 