import Chat from '@/components/chat/Chat';
import Screen from '@/components/screen/Screen';
import Sidebar from '@/components/sidebar/Sidebar';
import StatusIndicator from '@/components/screen/StatusIndicator';
import { NewTaskModal } from '@/components/chat/NewTaskModal';

export default function Agent() {
  return (
    <div className="min-h-[calc(100vh-73px)] max-h-[calc(100vh-73px)] overflow-hidden flex flex-col bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area with Chat and Screen side-by-side */}
      <div className="flex-1 transition-all duration-300 flex flex-col md:flex-row ml-[100px]">
        {/* Left side: Chat */}
        <div className="flex flex-col h-full w-full overflow-hidden p-4 gap-3 md:max-w-[35vw]">
          <Chat />
        </div>
        
        {/* Right side: Screen */}
        <div className="flex flex-col w-full p-4 gap-3">
          <div className="flex justify-between">
            <StatusIndicator />
          </div>
          <Screen />
        </div>
      </div>

      <NewTaskModal />
    </div>
  );
} 