import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Endpoint } from "@/lib/api/endpoints";
import { AGENT_ID, PROJECT_ID } from "@/lib/api/config";
import { cn } from "@/lib/utils";

interface ImageContentProps {
  source: string;
}

export function ImageContent({ source }: ImageContentProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Use the correct image source URL with proper endpoint
  const imageUrl = source.startsWith("http") 
    ? source 
    : `${Endpoint.chatbotApp}/image/${PROJECT_ID}/${AGENT_ID}/${source}`;

    // Handle blocking body scroll when expanded
  useEffect(() => {
    if (expanded) {
      // Disable scrolling on body
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling
      document.body.style.overflow = '';
    }
    
    // Cleanup function to ensure scroll is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [expanded]);
  
  return (
    <div className="relative group">
      <div
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "overflow-hidden rounded-md border border-border", 
          expanded ? "fixed inset-4 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" : "max-w-sm"
        )}
      >
        <img 
          src={imageUrl} 
          alt="Agent generated image" 
          className={cn(
            "object-contain", 
            expanded ? "max-h-full max-w-full" : "max-h-[300px] w-full"
          )} 
        />
      </div>
    </div>
  );
}