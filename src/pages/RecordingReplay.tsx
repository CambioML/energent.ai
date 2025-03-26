import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '@/components/sidebar/Sidebar';
import Chat from '@/components/chat/Chat';
import Screen from '@/components/screen/Screen';
import StatusIndicator from '@/components/screen/StatusIndicator';
import HistoryRecordings from '@/components/screen/HistoryRecordings';
import { Message } from '@/lib/store/chat';

export default function RecordingReplay() {
  const { recordingId } = useParams<{ recordingId: string }>();
  const [selectedRecordingId, setSelectedRecordingId] = useState<string | undefined>(recordingId);
  const [recordingMessages, setRecordingMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Effect to load recording data when a recording is selected
  useEffect(() => {
    if (!selectedRecordingId) return;

    const loadRecordingData = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call to fetch recording data
        // This is just mock data for now
        const mockMessages: Message[] = [
          { 
            id: '1', 
            content: 'Hello, I need help with a task', 
            isBot: false, 
            timestamp: new Date().getTime(),
            conversationId: '1',
          },
          { 
            id: '2', 
            content: 'I\'m here to help. What task do you need assistance with?', 
            isBot: true,
            timestamp: new Date().getTime(),
            conversationId: '1',
          },
          {
            id: '3',
            content: 'I want to create a new presentation',
            isBot: false,
            timestamp: new Date().getTime(),
            conversationId: '1',
          },
          {
            id: '4',
            content: 'I can help you create a presentation. What topic would you like to focus on?',
            isBot: true,
            timestamp: new Date().getTime(),
            conversationId: '1',
          }
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setRecordingMessages(mockMessages);
      } catch (error) {
        console.error('Failed to load recording data:', error);
        // Handle error
      } finally {
        setIsLoading(false);
      }
    };

    loadRecordingData();
  }, [selectedRecordingId]);

  const handleSelectRecording = (recordingId: string) => {
    setSelectedRecordingId(recordingId);
  };

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
            {selectedRecordingId && (
              <div className="text-sm text-muted-foreground">
                Viewing recording #{selectedRecordingId}
              </div>
            )}
          </div>
          <Chat historyMode={true} />
        </div>
        
        {/* Right side: Recording history instead of Screen */}
        <div className="flex flex-col w-full p-4 gap-3">
          <div className="flex justify-between">
            <StatusIndicator />
          </div>
          {selectedRecordingId ? (
            <Screen />
          ) : (
            <HistoryRecordings onSelectRecording={handleSelectRecording} />
          )}
        </div>
      </div>
    </div>
  );
} 