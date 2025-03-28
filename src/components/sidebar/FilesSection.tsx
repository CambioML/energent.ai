import { Files } from 'lucide-react';
import { useSidebarStore } from "@/lib/store/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
            <div className="flex flex-col items-center justify-center gap-3 py-8 text-center text-muted-foreground">
              <Files size={40} className="opacity-40" />
              <p>File access is coming soon</p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}; 