import { cn } from "@/lib/utils";
import { Check, X, FileOutput } from "lucide-react";
import { ParsedMessageContent } from "@/lib/utils/message-parser";
import { TextContent } from "./TextContent";
import { ImageContent } from "./ImageContent";

interface ToolResultContentProps {
  content: ParsedMessageContent[];
  isError: boolean;
}

export function ToolResultContent({ content, isError }: ToolResultContentProps) {
  return (
    <div className={cn(
      "rounded-md p-3 flex flex-col gap-2 my-2 text-sm border",
      isError 
        ? "bg-destructive/10 border-destructive/30" 
        : "bg-secondary/40 border-secondary"
    )}>
      <div className="flex items-center gap-2">
        <FileOutput size={14} className="text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Tool result</span>
        {isError ? (
          <span className="flex items-center gap-1 text-xs text-destructive">
            <X size={12} className="text-destructive" /> Failed
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-green-500">
            <Check size={12} className="text-green-500" /> Success
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        {content.map((item, index) => (
          <div key={index}>
            {item.type === 'text' && (
              <TextContent content={item.content} isBot={true} />
            )}
            {item.type === 'image' && (
              <ImageContent source={item.content} />
            )}
            {/* Add more content types as needed */}
          </div>
        ))}
      </div>
    </div>
  );
} 