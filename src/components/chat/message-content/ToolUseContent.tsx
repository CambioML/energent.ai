import { cn } from "@/lib/utils";
import { 
  Camera, 
  Terminal, 
  MousePointer, 
  MousePointerClick,
  CircleDot,
  Pointer,
  Target
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ToolUseContentProps {
  name: string;
  input: Record<string, any>;
}

export function ToolUseContent({ name, input }: ToolUseContentProps) {
  // Get the action from the input if it exists
  const action = input.action || "execute";
  
  // Function to get the appropriate icon based on action type
  const getActionIcon = () => {
    switch (action) {
      case "screenshot":
        return <Camera size={16} className="text-primary" />;
      case "left_click":
        return <MousePointerClick size={16} className="text-blue-500" />;
      case "right_click":
        return <MousePointer size={16} className="text-amber-500" />;
      case "double_click":
        return <MousePointerClick size={16} className="text-emerald-500" />;
      case "middle_click":
        return <CircleDot size={16} className="text-violet-500" />;
      case "cursor_position":
        return <Target size={16} className="text-orange-500" />;
      default:
        return <Terminal size={16} className="text-muted-foreground" />;
    }
  };
  
  // Function to get friendly action name
  const getActionName = () => {
    switch (action) {
      case "screenshot":
        return "Taking screenshot";
      case "left_click":
        return "Left clicking";
      case "right_click":
        return "Right clicking";
      case "double_click":
        return "Double clicking";
      case "middle_click":
        return "Middle clicking";
      case "cursor_position":
        return "Checking cursor position";
      default:
        return action.replace(/_/g, ' ');
    }
  };
  
  // Function to render specific content based on action type
  const renderActionContent = () => {
    switch (action) {
      case "screenshot":
        return (
          <div className="text-xs text-muted-foreground">Capturing the virtual machine's screen</div>
        );
      case "left_click":
      case "right_click":
      case "double_click":
      case "middle_click":
        if (input.coordinates) {
          return (
            <div className="text-sm">
              <span className="font-medium">Coordinates:</span> {input.coordinates.x}, {input.coordinates.y}
            </div>
          );
        } else if (input.element) {
          return (
            <div className="text-sm">
              <span className="font-medium">Element:</span> {input.element}
            </div>
          );
        } else {
          return (
            <div className="text-sm">
              <span className="font-medium">Position:</span> {JSON.stringify(input)}
            </div>
          );
        }
      case "cursor_position":
        return (
          <div className="text-xs text-muted-foreground">Getting the current cursor position</div>
        );
      default:
        // For other actions, show a simplified JSON view
        return (
          <div className="text-sm space-y-1">
            {Object.entries(input).map(([key, value]) => (
              key !== 'action' && (
                <div key={key} className="flex items-start gap-2">
                  <span className="font-medium min-w-16">{key}:</span>
                  <span className="text-muted-foreground overflow-hidden text-ellipsis">
                    {typeof value === 'string' 
                      ? value 
                      : typeof value === 'object'
                        ? JSON.stringify(value)
                        : String(value)
                    }
                  </span>
                </div>
              )
            ))}
          </div>
        );
    }
  };
  
  return (
    <div className="bg-secondary/40 rounded-md px-2 pt-2 flex flex-col gap-2 text-sm shadow-xs border mt-1">
      <div className="flex items-center gap-2 border-b pb-2">
        <Terminal size={14} className="text-muted-foreground" />
        <Badge variant="outline" className="bg-primary/10 text-primary">
          {name}
        </Badge>
        <span className="text-xs text-muted-foreground">Tool execution</span>
      </div>
      
      <div className="bg-muted/40 p-3 rounded-md flex items-center gap-3 pt-0">
        <div className="flex items-center justify-center">
          {getActionIcon()}
        </div>
        <div className="flex-1">
          <div className="font-medium text-sm mb-1">{getActionName()}</div>
          {renderActionContent()}
        </div>
      </div>
    </div>
  );
} 