import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { LoadingDots } from '../ui/loading-dots';
import { Monitor, AlertCircle } from 'lucide-react';
import { useAgentStore, AgentStatus } from '@/lib/store/useAgentStore';
import { useQuery } from '@tanstack/react-query';
import { AgentAPI } from '@/lib/api/agent-api';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/lib/store/useChatStore';
import RecordingIndicator from './RecordingIndicator';

export default function Screen() {
  const { isGenerating } = useChatStore();
  const { agentId, status, setStatus, restartAgent } = useAgentStore();

  // Use React Query to poll for agent status
  useQuery({
    queryKey: ['agentStatus', agentId],
    queryFn: async () => {
      const { message: status } = await AgentAPI.getAgentStatus(agentId);
      setStatus(status as AgentStatus);
      return status;
    },
    refetchInterval: !isGenerating && status !== AgentStatus.Ready && status !== AgentStatus.Error ? 1000 : false, // Poll every second until Ready
    refetchIntervalInBackground: true,
    enabled: !!agentId,
  });

  // Handler for retry
  const handleRetry = async () => {
    await restartAgent();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full"
    >
      <Card className="h-full flex flex-col overflow-hidden bg-transparent py-0 shadow-xs">
        {status === AgentStatus.Starting ? (
          <div className="h-full flex items-center justify-center bg-muted/20">
            <div className="text-center p-8">
              <Monitor className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Starting Computer...</h3>
              <p className="text-muted-foreground pb-2">
                Please wait while the system initializes
              </p>
              <LoadingDots />
            </div>
          </div>
        ) : status === AgentStatus.Error ? (
          <div className="h-full flex items-center justify-center bg-muted/20">
            <div className="text-center p-8">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">Connection Error</h3>
              <p className="text-muted-foreground pb-4">
                There was a problem connecting to the agent
              </p>
              <Button onClick={handleRetry} className="mt-2">
                Retry Connection
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Recording indicator overlay */}
            <div className="absolute top-3 left-3 z-10">
              <RecordingIndicator />
            </div>
            {/* Computer iframe */}
            <div className="flex-1 relative">
              <iframe
                src={`https://agent-${agentId}.docseek.chat`}
                className="w-full h-full border-none"
                title="Computer Screen"
              ></iframe>
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
} 