import { motion } from 'framer-motion';
import ChatComponent from '@/components/chat/Chat';

export default function Chat() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col"
    >
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col overflow-hidden rounded-lg"
    >
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="font-semibold">AI</span>
            </div>
            <div>
              <h2 className="text-lg font-medium">Energent Assistant</h2>
              <p className="text-sm text-muted-foreground">AI-powered chat assistant</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <Messages />
        </div>
      </div>
    </motion.div>
    </motion.div>
  );
} 