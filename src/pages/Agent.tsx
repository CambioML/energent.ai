import Chat from '@/components/chat/Chat';
import Screen from '@/components/screen/Screen';
import Sidebar from '@/components/sidebar/Sidebar';
import StatusIndicator from '@/components/screen/StatusIndicator';
import StopAgentButton from '@/components/screen/StopAgentButton';
import { NewTaskModal } from '@/components/chat/NewTaskModal';
import { useOnLogin } from '@/lib/hooks/useOnLogin';
import { 
  ResizablePanel, 
  ResizableHandle,
  ResizablePanelGroup 
} from '@/components/ui/resizable';

export default function Agent() {
  // Initialize agent on login
  useOnLogin();

  return (
    <div className="min-h-[calc(100vh-73px)] max-h-[calc(100vh-73px)] overflow-hidden flex flex-col bg-background">
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
            className="p-4"
          >
            <div className="flex flex-col h-full w-full overflow-hidden gap-3">
              <Chat />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Right side: Screen */}
          <ResizablePanel className="p-4">
            <div className="flex flex-col w-full h-full gap-3">
              <div className="flex justify-between">
                <StatusIndicator />
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