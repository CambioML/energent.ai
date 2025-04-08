import { motion } from "framer-motion";
import { Zap, Send, Users, Database, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useChatStore } from "@/lib/store/useChatStore";
import { useAgentStore } from "@/lib/store/useAgentStore";
import { AgentAPI } from "@/lib/api/agent-api";
import toast from "react-hot-toast";

const CATEGORIES = [
  { name: "All", icon: Zap },
  { name: "HR", icon: Users },
  { name: "Data", icon: Database }
];


const EXAMPLE_TASKS = [
  {
    title: "AI HR Agent",
    description: "Search for qualified candidates in Abu Dhabi",
    category: "HR",
    icon: Users
  },
  {
    title: "AI Interviewer",
    description: "Conduct a customized candidate interview",
    category: "HR",
    icon: Video
  },
  {
    title: "AI Data Analyst",
    description: "Analyze the data of a company",
    category: "Data",
    icon: Database
  }
];

interface EmptyStateProps {
  onExampleClick: (example: string) => void;
}

export default function EmptyState({ onExampleClick }: EmptyStateProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { currentConversationId, sendMessage } = useChatStore();
  const { agentId, setIsRecordingVideo } = useAgentStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    if (!currentConversationId) {
      toast.error('No active conversation');
      return;
    }

    // Clear input
    const message = inputValue.trim();
    setInputValue('');
    
    // Send message to API
    await sendMessage(message);
    
    // Start video recording
    if (agentId && currentConversationId) {
      try {
        const result = await AgentAPI.startVideoRecording(agentId, currentConversationId);
        if (result.success) {
          setIsRecordingVideo(true);
        }
      } catch (error) {
        console.error("Failed to start video recording:", error);
      }
    }
  };

  const filteredTasks = EXAMPLE_TASKS.filter(task => 
    selectedCategory === 'All' || task.category === selectedCategory
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 h-full flex flex-col items-center">
      <div className="flex-1 flex items-center justify-center w-full max-w-4xl">
        <motion.div
          key="empty-state"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-center w-full"
        >
          <h2 className="text-4xl font-semibold mb-2 text-foreground">Welcome to Energent AI</h2>
          <h3 className="text-2xl text-muted-foreground mb-8">How can I help you today?</h3>

          {/* Large Input Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1.05 }}
            transition={{ delay: 0.2 }}
            className="mb-12 px-4 mx-auto w-full max-w-3xl"
          >
            <form onSubmit={handleSubmit} className="relative group">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Write a task to Energent AI..."
                className="w-full px-8 py-7 text-xl rounded-2xl bg-muted/50 focus:bg-muted/80 border-2 border-border/50 focus:border-primary outline-none text-foreground/70 focus:text-foreground placeholder:text-muted-foreground/50 transition-all duration-300 shadow-xl hover:shadow-2xl"
                autoFocus
              />
              <button 
                type="submit" 
                // disabled={!inputValue.trim()}
                aria-label="Send message"
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-primary text-primary-foreground opacity-80 group-hover:opacity-100 disabled:opacity-0 transition-opacity duration-200"
              >
                <Send className="h-6 w-6" />
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>

      <div className="w-full max-w-5xl mt-auto opacity-60 hover:opacity-90 transition-opacity duration-300">
        <p className="text-center text-muted-foreground/80 text-sm mb-4">Try one of these examples:</p>
        
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.name}
                variant={category.name === selectedCategory ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.name)}
                className="gap-2 text-xs"
              >
                <Icon className="h-3 w-3" />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Example Tasks */}
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-4"
        >
          {filteredTasks.map((task) => {
            const Icon = task.icon;
            return (
              <motion.div
                layout
                key={task.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                className="p-2 rounded-lg border border-border/40 bg-card/30 hover:bg-accent cursor-pointer flex items-center gap-2"
                onClick={() => onExampleClick(task.description)}
              >
                <div className="p-1 rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-xs">{task.title}</h4>
                  <p className="text-xs text-muted-foreground/70 truncated">{task.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
} 