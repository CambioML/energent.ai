import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '@/components/sidebar/Sidebar';
import Chat from '@/components/chat/Chat';
import Screen from '@/components/screen/Screen';
import StatusIndicator from '@/components/screen/StatusIndicator';
import { useChatStore } from '@/lib/store/chat';

export default function RecordingReplay() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { 
    setCurrentConversationId, 
    fetchConversation, 
    currentConversationId,
    conversations
  } = useChatStore();

  // Load conversation data when component mounts or conversation ID changes
  useEffect(() => {
    if (conversationId) {
      setCurrentConversationId(conversationId);
      fetchConversation(conversationId);
    }
  }, [conversationId, setCurrentConversationId, fetchConversation]);

  // Find current conversation details
  const currentConversation = conversations.find(
    (conversation) => conversation.id === currentConversationId
  );

  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area with Chat and Screen side-by-side */}
      <div className="flex-1 transition-all duration-300 flex flex-col md:flex-row ml-[100px]">
        {/* Left side: Chat in history mode */}
        <div className="flex flex-col h-full w-full overflow-hidden p-4 gap-3 max-w-[35vw]">
          <div className="flex justify-between items-center">
            <div className="text-lg font-medium">Recording Replay</div>
            {currentConversation && (
              <div className="text-sm text-muted-foreground">
                {currentConversation.summary}
              </div>
            )}
          </div>
          <Chat historyMode={true} />
        </div>
        
        {/* Right side: Screen component */}
        <div className="flex flex-col w-full p-4 gap-3">
          <div className="flex justify-between">
            <StatusIndicator />
          </div>
          <Screen />
        </div>
      </div>
    </div>
  );
} 