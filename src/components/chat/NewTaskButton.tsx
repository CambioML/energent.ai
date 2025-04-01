import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useAgentStore } from "@/lib/store/useAgentStore";

interface NewTaskButtonProps {
  className?: string;
}

export function NewTaskButton({ className }: NewTaskButtonProps) {
  const location = useLocation();
  const { openNewTaskModal } = useAgentStore();

  const handleClick = () => {
    if (location.pathname.startsWith("/history")) {
      window.location.href = "/agent";
    } else {
      openNewTaskModal();
    }
  }

  return (
    <Button 
      variant="default" 
      className={cn("w-1/2 gap-2 font-medium", className)}
      onClick={handleClick}
    >
      <Zap size={18} />
      New Task
    </Button>
  );
}
