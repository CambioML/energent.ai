import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { NewTaskModal } from "./NewTaskModal";

interface NewTaskButtonProps {
  className?: string;
  onClick?: (keepLayout: boolean) => void;
}

export function NewTaskButton({ className = "w-1/2 gap-2 font-medium", onClick }: NewTaskButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewTask = (keepLayout: boolean) => {
    if (onClick) {
      onClick(keepLayout);
    } else {
      console.log("New task requested with keepLayout:", keepLayout);
    }
  };

  return (
    <>
      <Button 
        variant="default" 
        className={className}
        onClick={() => setIsModalOpen(true)}
      >
        <Zap size={18} />
        New Task
      </Button>

      <NewTaskModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleNewTask}
      />
    </>
  );
}
