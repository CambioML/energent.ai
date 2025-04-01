import { motion } from 'framer-motion';
import { StopCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAgentStore, AgentStatus } from '@/lib/store/useAgentStore';
import { toast } from 'react-hot-toast';

export default function StopAgentButton() {
  const { status, stopAgent } = useAgentStore();
  
  const isRunning = status === AgentStatus.Running;
  
  const handleClick = async () => {
      // await stopAgent();
      toast("Not implemented yet!");
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
