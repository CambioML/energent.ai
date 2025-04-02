import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAgentStore, AgentStatus } from '@/lib/store/useAgentStore';

export default function StatusIndicator() {
  const { status } = useAgentStore();

  // Function to determine the color of the status indicator
  const getStatusColor = () => {
    switch (status) {
      case AgentStatus.Starting: return 'bg-amber-500';
      case AgentStatus.Running: return 'bg-green-500';
      case AgentStatus.Ready: return 'bg-blue-500';
      case AgentStatus.Error: return 'bg-red-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div 
      className="flex items-center gap-2"
    >
      <Button 
        variant="outline" 
        size="sm" 
        className="font-medium px-4 h-[36px] gap-2"
      >
        <span className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          <span>Status:</span>
          <span className={cn("font-medium", {
            "text-amber-500": status === AgentStatus.Starting,
            "text-green-500": status === AgentStatus.Running,
            "text-blue-500": status === AgentStatus.Ready,
            "text-red-500": status === AgentStatus.Error
          })}>
            {status}
          </span>
        </span>
        <span 
          className={cn("h-2 w-2 rounded-full mt-0.5", 
            getStatusColor()
          )} 
        />
      </Button>
    </div>
  );
}
