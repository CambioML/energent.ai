import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send } from 'lucide-react';
import { useChatStore } from '@/lib/store/chat';
import { Messages } from './Messages';
import toast from 'react-hot-toast';

interface ChatProps {
  historyMode?: boolean;
}

export default function Chat({ historyMode = false }: ChatProps) {
  const [inputValue, setInputValue] = useState('');
  const { currentConversationId, sendMessage } = useChatStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || historyMode) return;
    
    if (!currentConversationId) {
      toast.error('No active conversation');
      return;
    }

    // Clear input
    const message = inputValue.trim();
    setInputValue('');
    
    // Send message to API
    await sendMessage(message);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex flex-col rounded-lg border h-[calc(100vh-100px)] overflow-hidden"
    >
      <div className="flex-1 overflow-hidden">
        <Messages />
      </div>
      
      {/* Input box - Styled without Card for cleaner design */}
      <div className="border-t border-border/50 py-3 px-4 bg-background/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={historyMode ? "Viewing history mode..." : "Type your message..."}
            disabled={historyMode}
            className="flex-1 bg-muted/50 focus:bg-muted/80 rounded-lg py-2.5 px-4 border-0 outline-none text-sm font-normal text-foreground/70 focus:text-foreground placeholder:text-foreground/40 placeholder:font-light placeholder:text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          
          <button 
            type="submit" 
            disabled={!inputValue.trim() || historyMode}
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