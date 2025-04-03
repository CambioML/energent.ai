import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAgentStore } from "@/lib/store/useAgentStore";
import { useSidebarStore } from "@/lib/store/useSidebarStore";
import { NewTaskButton } from "@/components/chat/NewTaskButton";
import { FilesSection } from "@/components/sidebar/FilesSection";
import { UploadSection } from "@/components/sidebar/UploadSection";
import { SidebarButton } from "@/components/sidebar/SidebarButton";
import { SystemPromptButton } from "@/components/sidebar/SystemPromptButton";
import { SystemPromptSection } from "@/components/sidebar/SystemPromptSection";
import { TaskHistorySection } from "@/components/sidebar/TaskHistorySection";
import { History, Files, Upload, PanelLeftOpen, PanelLeftClose, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AgentAPI } from "@/lib/api/agent-api";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function Sidebar() {
  const { 
    isExpanded, 
    handleButtonClick, 
    toggleSidebar
  } = useSidebarStore();
  const { 
    agentId,
    projectId,
    openNewTaskModal, 
    setSystemPrompt, 
    setIsSystemPromptLoading,
  } = useAgentStore();

  const location = useLocation();

  // Load system prompt
  useQuery({
    queryKey: ['systemPrompt'],
    queryFn: async () => {
      try {
        setIsSystemPromptLoading(true);
        const prompt = await AgentAPI.getSystemPrompt();
        setSystemPrompt(prompt);
        return prompt;
      } catch (error) {
        console.error("Failed to load system prompt:", error);
        toast.error("Failed to load system prompt");
        throw error;
      } finally {
        setIsSystemPromptLoading(false);
      }
    },
    enabled: Boolean(projectId && agentId)
  });

  // Animation variants
  const sidebarVariants = {
    expanded: {
      width: "500px",
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    collapsed: {
      width: "90px",
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  const handleNewTask = () => {
    if (location.pathname.startsWith("/history")) {
      window.location.href = "/agent";
    } else {
      openNewTaskModal();
    }
  };

  return (
    <>
      {/* Backdrop for clicking to collapse */}
      {isExpanded && (
        <motion.div
          initial="hidden"
          animate="visible"
          className="fixed inset-0 z-[5]"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      <motion.div
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={sidebarVariants}
        className="fixed left-0 top-workspace h-workspace bg-card border-r z-10 overflow-hidden shadow-sm"
      >
        <div className="flex flex-col h-workspace pt-2 overflow-auto">
          {/* Section Content */}
          {!isExpanded ? (
            <div className="flex flex-col justify-center gap-2 px-2 mb-4">
              <SidebarButton
                icon={<PanelLeftOpen className="size-5" />}
                label="Expand"
                onClick={toggleSidebar}
              />

              <SidebarButton
                icon={<Zap className="size-5" />}
                label="New Task"
                onClick={handleNewTask}
              />

              <SidebarButton
                icon={<History className="size-5" />}
                label="History"
                onClick={() => handleButtonClick("history")}
              />

              <SidebarButton
                icon={<Files className="size-5" />}
                label="Files"
                onClick={() => handleButtonClick("files")}
              />

              <SidebarButton
                icon={<Upload className="size-5" />}
                label="Upload"
                onClick={() => handleButtonClick("upload")}
              />
              
              <SystemPromptButton />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.1 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex justify-between items-center p-2">
                <NewTaskButton />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  aria-label="Collapse sidebar"
                  className="h-12 w-12"
                >
                  <PanelLeftClose className="size-6" />
                </Button>
              </div>
              <div className="flex flex-col overflow-y-auto">
                <TaskHistorySection />
                <FilesSection />
                <UploadSection />
                <SystemPromptSection />
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}
