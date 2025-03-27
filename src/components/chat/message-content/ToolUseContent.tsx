import { 
  Camera, 
  Terminal, 
  MousePointer, 
  MousePointerClick,
  CircleDot,
  Target,
  Keyboard,
  Command
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
      case "key":
        return <Keyboard size={16} className="text-primary" />;
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
      case "mouse_move":
        return <MousePointer size={16} className="text-indigo-500" />;
      case "execute":
        return <Command size={16} className="text-primary" />;
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
      case "mouse_move":
        return "Mouse Move";
      case "key":
        return "Keyboard Input";
      case "execute":
        return "Execute Command";
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
      case "mouse_move":
        if (input.coordinate) {
          // Format for mouse move - visual representation of coordinates
          const coord = Array.isArray(input.coordinate) ? input.coordinate : [0, 0];
          const [x, y] = coord;
          
          return (
            <div className="flex items-center mt-1 gap-3">
              <div className="text-xs font-mono text-muted-foreground">
                {x}, {y}
              </div>
            </div>
          );
        } else {
          return null;
        }
      case "left_click":
      case "right_click":
      case "double_click":
      case "middle_click":
        return null;
      case "cursor_position":
        return (
          <div className="text-xs text-muted-foreground">Getting the current cursor position</div>
        );
      case "key":
        return (
          <div className="text-xs text-muted-foreground">
            {input.text}
          </div>
        )
      case "execute":
        return (
          <div className="font-mono text-xs px-2 py-1.5 bg-black/80 text-green-400 rounded-md mt-2 overflow-x-auto">
            $ {input.command}
          </div>
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
        <div className="flex-1 space-y-1">
          <div className="font-medium text-sm">{getActionName()}</div>
          {renderActionContent()}
        </div>
      </div>
    </div>
  );
} 