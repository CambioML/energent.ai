import { motion } from "framer-motion";
import { Send, PlusCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingDots } from "@/components/ui/loading-dots";
import { MessageItem } from "./MessageItem";
import { useChatStore } from "@/lib/store/chat";
import toast from "react-hot-toast";
import { useAgentStore } from "@/lib/store/agent";

export function Messages() {
  const [inputValue, setInputValue] = useState("");
  const [userScrolled, setUserScrolled] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Global state from stores
  const { agentId } = useAgentStore();
  const { 
    messages, 
    isTyping, 
    currentConversationId,
    error,
    fetchConversation, 
    sendMessage, 
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
  
  // Initialize conversation if needed
  useEffect(() => {
    const initializeChat = async () => {
      if (!currentConversationId) {
        try {
          await fetchConversations();
          
          // If no conversations exist, create a new one
          if (!currentConversationId) {
            await createConversation("New Chat");
          }
        } catch (error) {
          console.error("Failed to initialize chat:", error);
          toast.error("Failed to initialize chat");
        }
      } else {
        // If we have a conversation ID, fetch its messages
        fetchConversation(currentConversationId);
      }
    };
    
    initializeChat();
  }, [currentConversationId, fetchConversations, createConversation, fetchConversation]);
  
  // Show error toast when errors occur
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    if (!currentConversationId) {
      toast.error("No active conversation");
      return;
    }

    // Clear input
    const message = inputValue.trim();
    setInputValue("");
    setUserScrolled(false);
    
    // Send message to API
    await sendMessage(message);
  };

  const handleMessageFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    sendFeedback(messageId, feedback);
  };
  
  const handleNewConversation = async () => {
    try {
      await createConversation("New Chat");
      toast.success("New conversation created");
    } catch (error) {
      console.error("Failed to create new conversation:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
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
      </div>
      
      {/* Input form */}
      <Card className="rounded-none p-4 border-t">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          
          <Button 
            type="submit" 
            size="icon" 
            className="shrink-0"
            disabled={!inputValue.trim()}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </Card>
    </div>
  );
} 