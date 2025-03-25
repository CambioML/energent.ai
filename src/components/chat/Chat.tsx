import { motion } from 'framer-motion';
import { Messages } from './Messages';

export default function Chat() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card w-full p-4 border h-full flex flex-col overflow-hidden rounded-lg"
    >
      <div className="flex-1 overflow-hidden">
        <Messages />
      </div>
    </motion.div>
  );
} 