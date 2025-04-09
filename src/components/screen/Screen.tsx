import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { LoadingDots } from '../ui/loading-dots';
import { Monitor, AlertCircle, Clipboard } from 'lucide-react';
import { useAgentStore, AgentStatus } from '@/lib/store/useAgentStore';
import { useQuery } from '@tanstack/react-query';
import { AgentAPI } from '@/lib/api/agent-api';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/lib/store/useChatStore';
import { VncScreen, type VncScreenHandle } from 'react-vnc';
import { useCallback, useRef } from 'react';

export default function Screen() {
  const { isGenerating } = useChatStore();
  const { agentId, status, setStatus } = useAgentStore();
  const vncRef = useRef<VncScreenHandle>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;

  // Use React Query to poll for agent status
  useQuery({
    queryKey: ['agentStatus', agentId],
    queryFn: async () => {
      const { message: status } = await AgentAPI.getAgentStatus(agentId);
      setStatus(status as AgentStatus);
      return status;
    },
    refetchInterval:
      !isGenerating && status !== AgentStatus.Ready && status !== AgentStatus.Error ? 1000 : false, // Poll every second until Ready
    refetchIntervalInBackground: true,
    enabled: !!agentId
  });

  // Clipboard paste handler
  const handleClipboardPaste = useCallback(async () => {
    console.log('Clipboard event');
    console.log(vncRef.current);
    if (vncRef.current && navigator.clipboard) {
      try {
        const text = await navigator.clipboard.readText();
        console.log('Clipboard text:', text);
        if (text && vncRef.current?.clipboardPaste) {
          // Set clipboard content in VM
          console.log('Pasting clipboard text:', text);
          vncRef.current.clipboardPaste(text);

          // Wait a moment for clipboard to be set
          setTimeout(() => {
            // Send Ctrl+V keystroke
            // For Windows/Linux VMs (Ctrl+V)
            if (vncRef.current?.sendKey) {
              // Key code for 'v' is 86
              // First press Ctrl key down
              vncRef.current.sendKey(0xffe3, 'ControlLeft', true); // Control key down
              // Then press V key down
              vncRef.current.sendKey(86, 'KeyV', true); // V key down

              // Small delay
              setTimeout(() => {
                // Release V key
                vncRef.current?.sendKey(86, 'KeyV', false); // V key up
                // Release Ctrl key
                vncRef.current?.sendKey(0xffe3, 'ControlLeft', false); // Control key up
              }, 10);
            }
          }, 10);
        }
      } catch (err) {
        console.error('Failed to read clipboard:', err);
      }
    }
  }, []);

  // Handler for manual reconnection
  const handleRetry = () => {
    reconnectAttempts.current = 0;
    if (vncRef.current) {
      vncRef.current.connect();
    }
  };

  // Handle disconnect with reconnect logic
  const handleDisconnect = useCallback(() => {
    console.log('VNC Disconnected, attempt:', reconnectAttempts.current);

    if (reconnectAttempts.current < maxReconnectAttempts) {
      reconnectAttempts.current += 1;
      console.log(`Reconnecting (attempt ${reconnectAttempts.current})...`);
      if (vncRef.current) {
        vncRef.current.connect();
      }
    } else {
      console.error('Failed to reconnect after maximum attempts');
      setStatus(AgentStatus.Error);
    }
  }, [setStatus]);

  // Reset reconnect counter when successfully connected
  const handleConnect = useCallback(() => {
    console.log('VNC Connected');
    reconnectAttempts.current = 0;
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full w-full">
      <Card className="h-full flex flex-col overflow-hidden py-0 shadow-xs">
        {status === AgentStatus.Starting ? (
          <div className="h-full flex items-center justify-center bg-muted/20">
            <div className="text-center p-8">
              <Monitor className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Starting Computer...</h3>
              <p className="text-muted-foreground pb-2">Please wait while the system initializes</p>
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
            {/* VNC connection */}
            <div className="flex-1 relative overflow-hidden">
              <VncScreen
                ref={vncRef}
                url={`wss://agent-${agentId}.docseek.chat/websockify`}
                scaleViewport
                resizeSession={false}
                clipViewport
                dragViewport
                className="w-full h-full"
                style={{
                  background: 'transparent'
                }}
                autoConnect
                viewOnly={false}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onClipboard={(event) => console.log('Clipboard event:', event.detail.text)}
                retryDuration={2000}
              />

              {/* Paste button floating at the corner */}
              <div className="absolute bottom-4 right-4 z-10">
                <Button
                  onClick={handleClipboardPaste}
                  size="sm"
                  variant="secondary"
                  className="shadow-md"
                >
                  <Clipboard className="mr-2 h-4 w-4" />
                  Paste
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
}
