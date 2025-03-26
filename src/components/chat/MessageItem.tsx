import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Message } from "@/lib/store/chat";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp, ThumbsDown, User, Bot, Copy, Share2, Pencil, Check, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { useChatStore } from "@/lib/store/chat";
import { MessageContent } from "./message-content/MessageContent";
import toast from "react-hot-toast";

interface MessageItemProps {
  message: Message;
  onFeedback?: (
    messageId: string,
    feedback: "good" | "bad",
    additionalFeedback?: string
  ) => void;
  historyMode?: boolean;
}

export function MessageItem({ message, onFeedback, historyMode = false }: MessageItemProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const { updateMessage } = useChatStore();

  // Reset copy state after 2 seconds
  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(() => {
        setIsCopied(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isCopied]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    toast.success("Message copied to clipboard");
  };

  const shareMessage = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Shared Message",
          text: message.content,
        })
        .catch((error) => {
          console.error("Error sharing message:", error);
        });
    } else {
      copyToClipboard();
      toast("Link copied, you can now paste and share it");
    }
  };

  const handleEdit = () => {
    if (historyMode) return; // Disable editing in history mode
    setIsEditing(true);
    setEditedContent(message.content);
  };

  const handleSave = () => {
    if (editedContent.trim() === "") {
      toast.error("Message cannot be empty");
      return;
    }
    
    updateMessage(message.id, { content: editedContent.trim() });
    setIsEditing(false);
    toast.success("Message edited");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(message.content);
  };

  // Disable editing in history mode
  const canEdit = !message.isBot && !historyMode;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-start gap-2.5 group",
        message.isBot ? "justify-start" : "justify-end"
      )}
    >
      {message.isBot && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot size={16} />
          </AvatarFallback>
        </Avatar>
      )}

      <div className="flex flex-col gap-2 max-w-[80%]">
        {isEditing && canEdit ? (
          <div className="flex flex-col gap-2">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="focus:border-primary"
              placeholder="Edit your message..."
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="flex items-center gap-1"
              >
                <X size={14} />
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                className="flex items-center gap-1"
              >
                <Check size={14} />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "px-4 py-2 rounded-lg",
              message.isBot
                ? "p-4 bg-muted text-foreground rounded-tl-none w-fit"
                : "bg-primary text-primary-foreground rounded-tr-none ml-auto"
            )}
          >
            <MessageContent content={message.content} isBot={message.isBot} />
          </div>
        )}

        {message.isBot && !isEditing && (
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={copyToClipboard}
                  >
                    <Copy
                      size={14}
                      className={cn(
                        isCopied ? "text-green-500" : "text-muted-foreground"
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={shareMessage}
                  >
                    <Share2 size={14} className="text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {onFeedback && !historyMode && (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onFeedback(message.id, "good")}
                      >
                        <ThumbsUp
                          size={14}
                          className={cn(
                            "text-muted-foreground",
                            message.feedback === "good" &&
                              "text-green-500 fill-green-500"
                          )}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Good response</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onFeedback(message.id, "bad")}
                      >
                        <ThumbsDown
                          size={14}
                          className={cn(
                            "text-muted-foreground",
                            message.feedback === "bad" &&
                              "text-red-500 fill-red-500"
                          )}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Bad response</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
          </div>
        )}

        {!message.isBot && !isEditing && (
          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={copyToClipboard}
                  >
                    <Copy
                      size={14}
                      className={cn(
                        isCopied ? "text-green-500" : "text-muted-foreground"
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {canEdit && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={handleEdit}
                    >
                      <Pencil size={14} className="text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit message</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
      </div>

      {!message.isBot && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <User size={16} />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
}
