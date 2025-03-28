import { cn } from "@/lib/utils";
import { AlertCircle, Terminal } from "lucide-react";
import { ParsedMessageContent } from "@/lib/utils/message-parser";
import { ImageContent } from "./ImageContent";

interface ToolResultContentProps {
  content: ParsedMessageContent[];
  isError: boolean;
  toolUseId?: string;
}

export function ToolResultContent({ content, isError, toolUseId }: ToolResultContentProps) {
  return (
    <div className={cn(
      "rounded-md overflow-hidden border my-3",
      isError 
        ? "border-destructive/30" 
        : "border-border"
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-3 py-2 text-xs font-medium",
        isError 
          ? "bg-destructive/10 text-destructive" 
          : "bg-muted/80 text-muted-foreground"
      )}>
        <div className="flex items-center gap-2">
          {isError ? (
            <AlertCircle size={14} className="text-destructive" />
          ) : (
            <Terminal size={14} />
          )}
          <span>
            {isError ? "Tool Execution Error" : "Tool Execution Result"}
          </span>
        </div>
        {toolUseId && (
          <span className="text-xs opacity-50">{toolUseId.split('_')[1]?.substring(0, 8)}</span>
        )}
      </div>
      
      {/* Content */}
      <div className="p-3 bg-muted/30">
        {content.map((item, index) => (
          <div key={index}>
            {item.type === 'text' && (
              <div className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                {item.content}
              </div>
            )}
            {item.type === 'image' && (
              <ImageContent source={item.content} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 