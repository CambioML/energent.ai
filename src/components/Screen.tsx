import { motion } from 'framer-motion';
import { Monitor } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { LoadingDots } from './ui/loading-dots';
import { useAgentStore } from '@/lib/store/agent';
import { useEffect } from 'react';

export default function Screen() {
  const { agentId, isAgentLoading, taskName, setIsAgentLoading } = useAgentStore();

  useEffect(() => {
    setTimeout(() => {
      setIsAgentLoading(false);
    }, 8000);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full"
    >
      <Card className="h-full flex flex-col overflow-hidden bg-transparent py-0">
        {!isAgentLoading && agentId ? (
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
        ) : (
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
        )}
      </Card>
    </motion.div>
  );
} 