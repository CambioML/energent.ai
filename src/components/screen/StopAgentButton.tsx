import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { useChatStore } from '@/lib/store/useChatStore';
import { StopCircleIcon, LoaderIcon } from "lucide-react";
import { useAgentStore, AgentStatus } from '@/lib/store/useAgentStore';

export default function StopAgentButton() {
  const { getLastMessageId } = useChatStore();
  const { status, stopAgent } = useAgentStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const isRunning = status === AgentStatus.Running;
  
  const handleClick = async () => {
    const messageId = await getLastMessageId();
    if (!messageId) {
      toast.error("No message ID found");
      return;
    }
    
    setIsLoading(true);
    const loading = toast.loading("Stopping agent...");
    
    try {
      await stopAgent(messageId);
      toast.success("Agent stopped successfully!", { id: loading });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to stop agent: ${errorMessage}`, { id: loading });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isRunning) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={isLoading}
        className="font-medium px-4 h-[36px] gap-2"
      >
        {isLoading ? (
          <LoaderIcon className="h-4 w-4 animate-spin text-red-600" />
        ) : (
          <StopCircleIcon className='text-red-600' />
        )}
        <span>{isLoading ? "Stopping..." : "Stop Agent"}</span>
      </Button>
    </motion.div>
  );
}
