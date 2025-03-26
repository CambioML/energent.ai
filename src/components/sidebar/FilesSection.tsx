import { Files } from 'lucide-react';
import { useSidebarStore } from "@/lib/store/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export const FilesSection = () => {
  const { expandedAccordions, toggleAccordion } = useSidebarStore();
  
  return (
    <Accordion 
      type="single" 
      collapsible 
      className="w-full" 
      defaultValue={expandedAccordions.files ? "files" : undefined}
      onValueChange={(value) => {
        if (value === "files" || value === undefined) {
          toggleAccordion("files");
        }
      }}
    >
      <AccordionItem value="files" className="border-0">
        <div className="flex items-center gap-3 p-4 border-b">
          <Files size={20} className="text-primary shrink-0" />
          <AccordionTrigger className="flex-1 flex justify-center items-center p-0 hover:no-underline">
            <h3 className="text-lg font-medium">Files Uploaded</h3>
          </AccordionTrigger>
        </div>
        <AccordionContent>
          <div className="p-4">
            <div className="space-y-4">
              <div className="p-3 bg-background rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <Files size={18} />
                  <span className="text-sm font-medium truncate">NVIDIA_Annual_Stoc...r_Meeting_2024.pdf</span>
                </div>
              </div>
              <div className="p-3 bg-background rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <Files size={18} />
                  <span className="text-sm font-medium truncate">Meta-Earnings-Presentation-Q2-2024.pdf</span>
                </div>
              </div>
              <div className="p-3 bg-background rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <Files size={18} />
                  <span className="text-sm font-medium truncate">Amazon.txt</span>
                </div>
              </div>
              <div className="p-3 bg-background rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <Files size={18} />
                  <span className="text-sm font-medium truncate">AT&T.txt</span>
                </div>
              </div>
              <div className="p-3 bg-background rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <Files size={18} />
                  <span className="text-sm font-medium truncate">InteractiveBrokersSampleStatementShort</span>
                </div>
              </div>
              <div className="p-3 bg-background rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <Files size={18} />
                  <span className="text-sm font-medium truncate">fidelity-sample</span>
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}; 