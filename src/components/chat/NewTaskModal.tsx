import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { LayoutGrid, Zap } from "lucide-react";
import { useAgentStore } from "@/lib/store/agent";

export function NewTaskModal() {
  const { isNewTaskModalOpen, closeNewTaskModal, handleNewTask } = useAgentStore();
  const [keepLayout, setKeepLayout] = useState(true);

  return (
    <Dialog open={isNewTaskModalOpen} onOpenChange={closeNewTaskModal}>
      <DialogContent className="sm:max-w-lg md:max-w-xl p-0 gap-0 overflow-hidden">
        <div className="relative" >
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <DialogTitle className="text-xl">Create New Task</DialogTitle>
            </div>
            <DialogDescription className="text-base">
              Start a new task with a fresh chat interface.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <LayoutGrid className="h-6 w-6 text-primary/80 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-base font-medium">Keep current desktop layout</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your current workspace arrangement will be preserved for your new task.
                  </p>
                </div>
              </div>
              <Switch
                checked={keepLayout}
                onCheckedChange={setKeepLayout}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            <DialogFooter className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => closeNewTaskModal()}
                className="px-5"
              >
                Cancel
              </Button>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button 
                  className="px-5 gap-2"
                  onClick={() => {
                    handleNewTask(keepLayout);
                    closeNewTaskModal();
                  }}
                >
                  <Zap />
                  Create Task
                </Button>
              </motion.div>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 