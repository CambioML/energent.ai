import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAgentStore } from '@/lib/store/agent';

type StatusType = 'Starting' | 'Running' | 'Ready';

export default function StatusIndicator() {
  const { agentId, isAgentLoading } = useAgentStore();
  const [status, setStatus] = useState<StatusType>(isAgentLoading ? 'Starting' : 'Running');

  useEffect(() => {
    // For demo purposes: When agent is no longer loading and has an ID, 
    // we'll consider it ready. Otherwise follow the loading state.
    if (!isAgentLoading && agentId) {
      setStatus('Ready');
    } else if (isAgentLoading) {
      setStatus('Starting');
    } else {
      setStatus('Running');
    }
  }, [isAgentLoading, agentId]);

  // Function to determine the color of the status indicator
  const getStatusColor = () => {
    switch (status) {
      case 'Starting': return 'bg-amber-500';
      case 'Running': return 'bg-green-500';
      case 'Ready': return 'bg-blue-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2"
    >
      <Button 
        variant="outline" 
        size="sm" 
        className="font-medium px-4 h-[36px] gap-2"
      >
        <span className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          <span>Status:</span>
          <span className={cn("font-medium", {
            "text-amber-500": status === 'Starting',
            "text-green-500": status === 'Running',
            "text-blue-500": status === 'Ready'
          })}>
            {status}
          </span>
        </span>
        <span 
          className={cn("h-2 w-2 rounded-full mt-0.5", 
            getStatusColor()
          )} 
        />
      </Button>
    </motion.div>
  );
}
