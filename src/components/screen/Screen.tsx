import { motion } from 'framer-motion';
import { Monitor, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { LoadingDots } from '../ui/loading-dots';
import { useAgentStore, AgentStatus } from '@/lib/store/agent';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AgentAPI } from '@/lib/api/agent-api';
import { Button } from '@/components/ui/button';

export default function Screen() {
  const { agentId, status, setStatus, resetAgent } = useAgentStore();

  // Use React Query to poll for agent status
  const { data, isError } = useQuery({
    queryKey: ['agentStatus', agentId],
    queryFn: () => AgentAPI.getAgentStatus(agentId),
    refetchInterval: status !== AgentStatus.Ready && status !== AgentStatus.Error ? 1000 : false, // Poll every second until Ready
    refetchIntervalInBackground: true,
    enabled: !!agentId,
  });

  // Update status when data changes or error occurs
  useEffect(() => {
    if (isError) {
      setStatus(AgentStatus.Error);
    } else if (data && data.message) {
      setStatus(data.message as AgentStatus);
    }
  }, [data, isError, setStatus]);

  // Handler for retry
  const handleRetry = async () => {
    await resetAgent();
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