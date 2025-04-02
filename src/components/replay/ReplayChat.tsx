"use client";

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Messages } from '../chat/Messages';

export default function ReplayChat() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="h-full w-full flex flex-col rounded-lg border overflow-hidden"
    >
      <div className="flex-1 overflow-hidden">
        <Messages />
      </div>
      
      <div className="border-t border-border/50 py-3 px-4 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <Clock className="h-4 w-4" />
          <span>Viewing conversation history</span>
        </div>
      </div>
    </motion.div>
  );
} 