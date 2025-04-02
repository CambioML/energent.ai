"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { SidebarButton } from "@/components/sidebar/SidebarButton";
import { SystemPromptModal } from "@/components/sidebar/SystemPromptModal";

export const SystemPromptButton = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <SidebarButton
        icon={<Settings className="size-5" />}
        label="Prompt"
        onClick={openModal}
      />

      <SystemPromptModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}; 