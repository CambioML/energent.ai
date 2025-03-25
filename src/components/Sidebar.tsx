import { motion } from "framer-motion";
import { History, Files, Upload, ChevronLeft } from "lucide-react";
import { TaskHistorySection } from "@/components/sidebar/TaskHistorySection";
import { FilesSection } from "@/components/sidebar/FilesSection";
import { UploadSection } from "@/components/sidebar/UploadSection";
import { SidebarButton } from "@/components/sidebar/SidebarButton";
import { useSidebarStore } from "@/lib/store/sidebar";
import { Button } from "@/components/ui/button";
import { NewTaskButton } from "@/components/chat/NewTaskButton";

export default function Sidebar() {
  const { isExpanded, activeButton, handleButtonClick, toggleSidebar } = useSidebarStore();

  // Animation variants
  const sidebarVariants = {
    expanded: {
      width: "calc(100% / 4)",
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    collapsed: {
      width: "90px",
      transition: { duration: 0.2, ease: "easeInOut" },
    },
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
        className="fixed left-0 top-[73px] h-[calc(100vh-73px)] bg-card border-r z-10 overflow-hidden shadow-sm"
      >
        <div className="flex flex-col h-full pt-6">
          {/* Section Content */}
          {!isExpanded ? (
            <div className="flex flex-col justify-center gap-2 px-2 mb-4">
              <SidebarButton
                icon={<History size={30} />}
                label="History"
                isActive={activeButton === "history"}
                onClick={() => handleButtonClick("history")}
              />

              <SidebarButton
                icon={<Files size={30} />}
                label="Files"
                isActive={activeButton === "files"}
                onClick={() => handleButtonClick("files")}
              />

              <SidebarButton
                icon={<Upload size={30} />}
                label="Upload"
                isActive={activeButton === "upload"}
                onClick={() => handleButtonClick("upload")}
              />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex justify-between px-4 mb-4">
                <NewTaskButton />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={toggleSidebar}
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft size={22} />
                </Button>
              </div>
              
              <div className="flex flex-col overflow-y-auto">
                <TaskHistorySection />
                <FilesSection />
                <UploadSection />
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}
