import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { StopCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStore } from '@/lib/store/useChatStore';
import { useAgentStore, AgentStatus } from '@/lib/store/useAgentStore';

export default function StopAgentButton() {
  const { getLastMessageId } = useChatStore();
  const { status, stopAgent } = useAgentStore();
  
  const isRunning = status === AgentStatus.Running;
  
  const handleClick = async () => {
    const messageId = await getLastMessageId();
    if (!messageId) {
      toast.error("No message ID found");
      return;
    }
    await stopAgent(messageId);
    toast.success("Agent stopped successfully!");
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
        className="font-medium px-4 h-[36px] gap-2"
      >
        <StopCircleIcon className='text-red-600' />
        <span>Stop Agent</span>
      </Button>
    </motion.div>
  );
}
