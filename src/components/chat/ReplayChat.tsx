"use client";

import { motion } from 'framer-motion';
import { useChatStore } from '@/lib/store/useChatStore';
import { Messages } from './Messages';
import { Clock } from 'lucide-react';

export default function ReplayChat() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="w-full flex flex-col rounded-lg border h-[calc(100vh-100px)] overflow-hidden"
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