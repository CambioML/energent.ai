import Chat from "@/components/chat/Chat";
import Screen from "@/components/screen/Screen";
import Sidebar from "@/components/sidebar/Sidebar";
import StatusIndicator from "@/components/screen/StatusIndicator";
import StopAgentButton from "@/components/screen/StopAgentButton";
import { useEffect } from "react";
import { NewTaskModal } from "@/components/chat/NewTaskModal";
import { useLoadAgent } from "@/lib/hooks/useLoadAgent";
import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import RecordingIndicator from "@/components/screen/RecordingIndicator";
import { useAgentStore } from "@/lib/store/useAgentStore";
import { useChatStore } from "@/lib/store/useChatStore";
import { motion } from "framer-motion";

export default function Agent() {
  // Initialize agent on login
  useLoadAgent();
  const { messages, messagesLoaded } = useChatStore();

  useEffect(() => {
    const { setHistoryMode } = useAgentStore.getState();
    setHistoryMode(false);
  }, []);

  return (
    <div className="h-workspace overflow-hidden flex flex-col bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area with Chat and Screen side-by-side */}
      <div className="flex-1 transition-all duration-300 flex flex-col md:flex-row ml-[100px]">
        <ResizablePanelGroup direction="horizontal" className="w-full h-full">
          {/* Left side: Screen - Only show if there are messages */}
          {messagesLoaded && messages.length > 0 && (
            <ResizablePanel
              defaultSize={65} // Set larger default size for left panel
              minSize={40} // Set appropriate min size
              maxSize={80} // Set appropriate max size
              className="p-4 h-workspace"
            >
              <div className="flex flex-col w-full h-full gap-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.0 }}
                      className="flex items-center gap-2"
                    >
                      <h2 className="text-lg font-medium">
                        Energent.ai's virtual computer
                      </h2>
                    </motion.div>
                    <StatusIndicator />
                    <RecordingIndicator />
                  </div>
                  <StopAgentButton />
                </div>
                <Screen />
              </div>
            </ResizablePanel>
          )}

          {/* Right side: Chat with handle on left side */}
          {messagesLoaded && messages.length > 0 && (
            <ResizableHandle withHandle />
          )}

          <ResizablePanel
            defaultSize={messages.length > 0 ? 35 : 100}
            minSize={20}
            maxSize={60}
            className="p-4 h-workspace"
          >
            <div className="flex flex-col h-full w-full overflow-hidden gap-3">
              <Chat />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <NewTaskModal />
    </div>
  );
}
