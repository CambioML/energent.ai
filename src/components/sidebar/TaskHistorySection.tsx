import { Laptop, MessageSquare } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const TaskHistorySection = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="tasks-history">
        <AccordionTrigger className="flex items-center gap-3 p-4 border-b">
          <Laptop size={22} className="text-primary shrink-0" />
          <h3 className="text-lg font-medium">Tasks History</h3>
        </AccordionTrigger>
        <AccordionContent>
          <div className="overflow-auto h-[20vh] p-4">
            <div className="space-y-4">
              <div className="p-3 bg-background rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} />
                  <span className="text-sm font-medium truncate">Audio Transcription Request</span>
                </div>
              </div>
              <div className="p-3 bg-background rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} />
                  <span className="text-sm font-medium truncate">Free Zone Tax: Crucial for your business</span>
                </div>
              </div>
              <div className="p-3 bg-background rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} />
                  <span className="text-sm font-medium truncate">BSEE API Well Number</span>
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}; 