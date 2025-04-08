"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { SystemPromptModal } from "./SystemPromptModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem
} from "@/components/ui/accordion";

export const SystemPromptSection = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handler for the entire section click
  const handleSectionClick = (e: React.MouseEvent) => {
    // Prevent the accordion from toggling
    e.preventDefault();
    e.stopPropagation();
    openModal();
  };

  return (
    <>
      <Accordion type="single" collapsible className="w-full" value="">
        <AccordionItem value="system-prompt" className="border-0">
          <div 
            className="flex items-center gap-3 p-4 border-b cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={handleSectionClick}
          >
            <Settings size={20} className="shrink-0" />
            <div className="flex-1 flex justify-start items-center p-0">
              <h3 className="text-lg font-medium">System Prompt</h3>
            </div>
          </div>
          <AccordionContent>
            {/* This content won't be shown because we're controlling click behavior */}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <SystemPromptModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}; 
