import { motion } from 'framer-motion';
import { Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAgentStore } from '@/lib/store/useAgentStore';

export default function RecordingIndicator() {
  const { isRecordingVideo } = useAgentStore();

  if (!isRecordingVideo) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex items-center gap-2"
    >
      <Button 
        variant="outline" 
        size="sm" 
        className="font-medium px-4 h-[36px] gap-2"
      >
        <span className="flex items-center gap-2">
          <Video className="h-4 w-4 text-amber-500" />
          <span>Recording:</span>
          <span className="font-medium text-amber-500">
            Active
          </span>
        </span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
      </Button>
    </motion.div>
  );
} 