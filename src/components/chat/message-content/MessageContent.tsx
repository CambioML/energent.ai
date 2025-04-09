import { useEffect, useState } from "react";
import { parseAutoAgentResponse, ParsedMessageContent } from "@/lib/utils/message-parser";
import { TextContent } from "./TextContent";
import { ImageContent } from "./ImageContent";
import { ToolUseContent } from "./ToolUseContent";
import { ToolResultContent } from "./ToolResultContent";
import { BrainCircuit } from "lucide-react";

interface MessageContentProps {
  content: string;
  isBot: boolean;
}

export function MessageContent({ content, isBot }: MessageContentProps) {
  const [parsedContents, setParsedContents] = useState<ParsedMessageContent[] | null>(null);
  
  // Parse AutoAgentResponse format if present
  useEffect(() => {
    if (isBot) {
      const parsed = parseAutoAgentResponse(content);
      setParsedContents(parsed);
    }
  }, [content, isBot]);

  // Regular text message (either user message or non-AutoAgentResponse bot message)
  if (!parsedContents) {
    return <TextContent content={content} />;
  }

  // AutoAgentResponse format with multiple content types
  return (
    <div className="space-y-2">
      {/* Optional header indicating AI is using tools */}
      {parsedContents.some(c => c.type === 'tool_use') && (
        <div className="flex items-center gap-2 text-xs mb-2 pb-2">
          <BrainCircuit size={14} />
          <span>AI is using tools to complete this task</span>
        </div>
      )}
      
      {/* Render each content piece */}
      {parsedContents.map((item, index) => (
        <div key={index}>
          {item.type === 'text' && (
            <TextContent content={item.content} />
          )}
          
          {item.type === 'image' && (
            <div className="my-4">
              <ImageContent source={item.content} />
            </div>
          )}
          
          {item.type === 'tool_use' && (
            <ToolUseContent 
              name={item.content.name} 
              input={item.content.input} 
            />
          )}
          
          {item.type === 'tool_result' && item.content.length > 0 && (
            <ToolResultContent 
              content={item.content} 
              isError={(item as any).is_error || false}
              toolUseId={(item as any).tool_use_id}
            />
          )}
        </div>
      ))}
    </div>
  );
} 