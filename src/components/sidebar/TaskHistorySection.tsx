import { Laptop, MessageSquare } from 'lucide-react';
import { useSidebarStore } from "@/lib/store/sidebar";
import { useChatStore } from "@/lib/store/chat";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from 'react';

export const TaskHistorySection = () => {
  const { expandedAccordions, toggleAccordion } = useSidebarStore();
  const { 
    conversations, 
    currentConversationId, 
    fetchConversations, 
    setCurrentConversationId,
    fetchConversation
  } = useChatStore();
  
  // Fetch conversations when component mounts
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);
  
  // Handle task click
  const handleTaskClick = async (conversationId: string) => {
    if (conversationId !== currentConversationId) {
      setCurrentConversationId(conversationId);
      await fetchConversation(conversationId);
    }
  };
  
  return (
    <Accordion 
      type="single" 
      collapsible 
      className="w-full" 
      defaultValue={expandedAccordions.history ? "history" : undefined}
      onValueChange={(value) => {
        if (value === "history" || value === undefined) {
          toggleAccordion("history");
        }
      }}
    >
      <AccordionItem value="history" className="border-0">
        <div className="flex items-center gap-3 p-4 border-b">
          <Laptop size={20} className="text-primary shrink-0" />
          <AccordionTrigger className="flex-1 flex justify-center items-center p-0 hover:no-underline">
            <h3 className="text-lg font-medium">Tasks History</h3>
          </AccordionTrigger>
        </div>
        <AccordionContent>
          <div className="p-4">
            <div className="space-y-4">
              {conversations.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-2">
                  No tasks available
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentConversationId === conversation.id 
                        ? 'bg-accent' 
                        : 'bg-background hover:bg-accent/50'
                    }`}
                    onClick={() => handleTaskClick(conversation.id)}
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare size={18} />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium truncate block">{conversation.summary}</span>
                        <span className="text-xs text-muted-foreground">{new Date(conversation.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}; 