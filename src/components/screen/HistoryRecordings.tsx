import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Eye, Film, MessageSquare, Search } from "lucide-react";
import { useChatStore, Message } from "@/lib/store/chat";
import { useNavigate } from "react-router-dom";

interface HistoryRecordingsProps {
  onSelectRecording?: (recordingId: string) => void;
}

export default function HistoryRecordings({ onSelectRecording }: HistoryRecordingsProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { messages, conversations, currentConversationId } = useChatStore();
  
  // Filter messages based on search term
  const filteredMessages = messages.filter(message => 
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group messages by conversation for display
  const groupedMessages = filteredMessages.reduce<Record<string, Message[]>>((acc, message) => {
    if (!acc[message.conversationId]) {
      acc[message.conversationId] = [];
    }
    acc[message.conversationId].push(message);
    return acc;
  }, {});

  // Get conversation summary
  const getConversationSummary = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    return conversation?.summary || 'Unnamed Conversation';
  };

  // Handle view recording
  const handleViewRecording = (conversationId: string) => {
    if (onSelectRecording) {
      onSelectRecording(conversationId);
    } else {
      navigate(`/history/${conversationId}`);
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Film className="h-5 w-5" />
          Conversation History
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[calc(100vh-250px)] overflow-y-auto pr-2">
        <div className="h-[calc(100vh-250px)] overflow-y-auto pr-2">
          <div className="space-y-2">
            {Object.keys(groupedMessages).length > 0 ? (
              Object.keys(groupedMessages).map((conversationId) => {
                const conversationMessages = groupedMessages[conversationId];
                // Get the latest message as preview
                const previewMessage = conversationMessages[conversationMessages.length - 1];
                
                return (
                  <div 
                    key={conversationId}
                    className={`p-3 rounded-md ${
                      currentConversationId === conversationId 
                        ? 'bg-accent' 
                        : 'hover:bg-muted/50'
                    } cursor-pointer transition-colors group`}
                    onClick={() => handleViewRecording(conversationId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{getConversationSummary(conversationId)}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(previewMessage.timestamp).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span className="truncate max-w-[200px]">
                              {previewMessage.content.length > 30 
                                ? `${previewMessage.content.substring(0, 30)}...` 
                                : previewMessage.content}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewRecording(conversationId);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                {searchTerm ? "No matching conversations found" : "No conversations available"}
              </div>
            )}
          </div>
        </div>
        </div>
      </CardContent>
    </Card>
  );
} 