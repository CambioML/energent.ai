import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useAgentStore } from "@/lib/store/useAgentStore";

interface NewTaskButtonProps {
  className?: string;
}

export function NewTaskButton({ className = "w-1/2 gap-2 font-medium" }: NewTaskButtonProps) {
  const { openNewTaskModal } = useAgentStore();

  return (
    <Button 
      variant="default" 
      className={className}
      onClick={openNewTaskModal}
    >
      <Zap size={18} />
      New Task
    </Button>
  );
}
