import Chat from '@/components/chat/Chat';
import Screen from '@/components/screen/Screen';
import Sidebar from '@/components/sidebar/Sidebar';
import StatusIndicator from '@/components/screen/StatusIndicator';
import StopAgentButton from '@/components/screen/StopAgentButton';
import { useEffect } from 'react';
import { NewTaskModal } from '@/components/chat/NewTaskModal';
import { useLoadAgent } from '@/lib/hooks/useLoadAgent';
import { 
  ResizablePanel, 
  ResizableHandle,
  ResizablePanelGroup 
} from '@/components/ui/resizable';
import RecordingIndicator from '@/components/screen/RecordingIndicator';
import { useAgentStore } from '@/lib/store/useAgentStore';

export default function Agent() {
  // Initialize agent on login
  useLoadAgent();

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
          {/* Left side: Chat */}
          <ResizablePanel 
            defaultSize={35} 
            minSize={20} 
            maxSize={60}
            className="p-4 h-workspace"
          >
            <div className="flex flex-col h-full w-full overflow-hidden gap-3">
              <Chat />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Right side: Screen */}
          <ResizablePanel className="p-4 h-workspace">
            <div className="flex flex-col w-full h-full gap-3">
              <div className="flex justify-between items-center">
                <div className='flex items-center gap-2'>
                  <StatusIndicator />
                  <RecordingIndicator />
                </div>
                <StopAgentButton />
              </div>
              <Screen />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <NewTaskModal />
    </div>
  );
} 