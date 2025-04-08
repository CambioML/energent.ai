import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send } from 'lucide-react';
import { useChatStore } from '@/lib/store/useChatStore';
import { useAgentStore } from '@/lib/store/useAgentStore';
import { AgentAPI } from '@/lib/api/agent-api';
import toast from 'react-hot-toast';

export default function InputBox() {
  const [inputValue, setInputValue] = useState('');
  const { currentConversationId, sendMessage } = useChatStore();
  const { agentId, setIsRecordingVideo } = useAgentStore();

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
  );
}