import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useChatStore } from "@/lib/store/chat";
import { LoadingDots } from "@/components/ui/loading-dots";
import { MessageItem } from "./MessageItem";
import toast from "react-hot-toast";
import { MessageSquare } from "lucide-react";

export function Messages() {
  const [userScrolled, setUserScrolled] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Global state from stores
  const { 
    error,
    isTyping,
    currentConversationId,
    messages, 
    fetchConversation, 
    fetchConversations,
    createConversation,
    sendFeedback 
  } = useChatStore();
  
  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (!userScrolled && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Detect if user has scrolled up
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isScrolledToBottom = scrollHeight - scrollTop - clientHeight < 10;
      setUserScrolled(!isScrolledToBottom);
    }
  };
  
  // Initialize conversation if needed - only if not in history mode
  useEffect(() => {
    const initializeChat = async () => {
      try {
        if (!currentConversationId) {
          const conversations = await fetchConversations();
          
          // Only create a new conversation if there are no conversations at all
          if (Array.isArray(conversations) && conversations.length === 0) {
            await createConversation("New Chat");
          }
        }
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        toast.error("Failed to initialize chat");
      }
    };
    
    initializeChat();
  }, []);

  useEffect(() => {
    if (currentConversationId) {
      fetchConversation(currentConversationId);
    }
  }, [currentConversationId, fetchConversation]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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
      {messages.length === 0 ? (
        renderLoadingState()
      ) : (
        renderMessages()
      )}
    </AnimatePresence>
  );
} 