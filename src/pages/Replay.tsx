import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { VideoRecording } from '@/components/replay/VideoRecording';
import { useChatStore } from '@/lib/store/useChatStore';
import { Clock } from 'lucide-react';
import { 
  ResizablePanel, 
  ResizableHandle,
  ResizablePanelGroup 
} from '@/components/ui/resizable';
import { useLoadAgent } from '@/lib/hooks/useLoadAgent';
import { useAgentStore } from '@/lib/store/useAgentStore';
import Sidebar from '@/components/sidebar/Sidebar';
import ReplayChat from '@/components/replay/ReplayChat';

export default function Replay() {
  // Initialize agent on login
  useLoadAgent();

  useEffect(() => {
    const { setHistoryMode } = useAgentStore.getState();
    setHistoryMode(true);
  }, []);

  const { conversationId } = useParams<{ conversationId: string }>();
  const { 
    setCurrentConversationId, 
    currentConversationId,
    conversations
  } = useChatStore();

  // Load conversation data when component mounts or conversation ID changes
  useEffect(() => {
    if (conversationId) {
      setCurrentConversationId(conversationId);
    }
  }, [conversationId, setCurrentConversationId]);

  // Find current conversation details
  const currentConversation = conversations.find(
    (conversation) => conversation.id === currentConversationId
  );

  return (
    <div className="h-workspace overflow-hidden flex flex-col bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area with Chat and VideoRecording side-by-side */}
      <div className="flex-1 transition-all duration-300 flex flex-col md:flex-row ml-[100px]">
        <ResizablePanelGroup direction="horizontal" className="w-full h-full">
          {/* Left side: Chat in replay mode */}
          <ResizablePanel 
            defaultSize={35} 
            minSize={20} 
            maxSize={60}
            className="p-4 h-workspace"
          >
            <div className="flex flex-col h-full w-full overflow-hidden gap-3">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 mb-1"
              >
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-medium">Recording Replay</h2>
                {currentConversation && (
                  <div className="text-sm text-muted-foreground ml-2">
                    {currentConversation.summary}
                  </div>
                )}
              </motion.div>
              <ReplayChat />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Right side: Video recording */}
          <ResizablePanel className="p-4 h-workspace">
            <div className="h-full flex flex-col w-full gap-3">
              <VideoRecording />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
} 