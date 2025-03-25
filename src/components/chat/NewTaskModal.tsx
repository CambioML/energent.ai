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

interface NewTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (keepLayout: boolean) => void;
}

export function NewTaskModal({ open, onOpenChange, onConfirm }: NewTaskModalProps) {
  const [keepLayout, setKeepLayout] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Start a new task with new chat.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-between py-4">
          <div className="space-y-0.5">
            <h4 className="text-sm font-medium">Keep the current desktop layout for your new task?</h4>
            <p className="text-sm text-muted-foreground">
              Your current workspace arrangement will be preserved.
            </p>
          </div>
          <Switch
            checked={keepLayout}
            onCheckedChange={setKeepLayout}
          />
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => {
                onConfirm(keepLayout);
                onOpenChange(false);
              }}
            >
              Create Task
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 