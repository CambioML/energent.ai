import Sidebar from '@/components/Sidebar';
import Chat from '@/components/chat/Chat';
import Screen from '@/components/Screen';
import { NewTaskButton } from '@/components/chat/NewTaskButton';
import StatusIndicator from '@/components/screen/StatusIndicator';

export default function Agent() {
  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area with Chat and Screen side-by-side */}
      <div className="flex-1 transition-all duration-300 flex flex-col md:flex-row ml-[100px]">
        {/* Left side: Chat */}
        <div className="flex flex-col w-full p-4 gap-2 max-w-[35vw]">
          <div className="flex justify-between">
            <NewTaskButton className="w-1/3" />
          </div>
          <Chat />
        </div>
        
        {/* Right side: Screen */}
        <div className="flex flex-col w-full p-4 gap-2">
          <div className="flex justify-between">
            <StatusIndicator />
          </div>
          <Screen />
        </div>
      </div>
    </div>
  );
} 