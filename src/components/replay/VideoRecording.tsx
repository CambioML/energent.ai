"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChatAPI } from "@/lib/api/chat-api";
import { useAgentStore } from "@/lib/store/useAgentStore";
import { Card } from "@/components/ui/card";
import { Play, Pause, SkipBack, SkipForward, List, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VideoRecording {
  id: string;
  conversationId: string;
  videoUrl: string;
  timestamp: number;
  duration: number;
}

export const VideoRecording = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { projectId: currentProjectId, agentId: currentAgentId } = useAgentStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [recordings, setRecordings] = useState<VideoRecording[]>([]);
  const [currentRecording, setCurrentRecording] = useState<VideoRecording | null>(null);

  useEffect(() => {
    const fetchRecordings = async () => {
      if (!conversationId || !currentProjectId || !currentAgentId) return;
      
      setIsLoading(true);
      try {
        // const data = await ChatAPI.getVideoRecordings(conversationId, currentProjectId, currentAgentId);
        const data: VideoRecording[] = [
          {
            id: "rec_1",
            conversationId: conversationId || "",
            videoUrl: "https://example.com/video1.mp4",
            timestamp: Date.now() - 3600000, // 1 hour ago
            duration: 120 // 2 minutes
          },
          {
            id: "rec_2",
            conversationId: conversationId || "",
            videoUrl: "https://example.com/video2.mp4",
            timestamp: Date.now() - 7200000, // 2 hours ago
            duration: 180 // 3 minutes
          },
          {
            id: "rec_3",
            conversationId: conversationId || "",
            videoUrl: "https://example.com/video3.mp4",
            timestamp: Date.now() - 10800000, // 3 hours ago
            duration: 240 // 4 minutes
          }
        ];
        setRecordings(data);
        if (data.length > 0) {
          setCurrentRecording(data[0]);
        }
      } catch (error) {
        console.error("Error fetching video recordings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecordings();
  }, [conversationId, currentProjectId, currentAgentId]);

  const handleRecordingSelect = (recording: VideoRecording) => {
    setCurrentRecording(recording);
    setCurrentTime(0);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleSliderChange = (value: number[]) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleSkip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
    setCurrentTime(videoRef.current.currentTime);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full w-full"
      >
        <Card className="h-full flex flex-col overflow-hidden bg-transparent py-0 shadow-xs">
          <div className="h-full flex items-center justify-center bg-muted/20">
            <div className="flex flex-col items-center gap-4">
              <Camera className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">Loading recordings...</p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (!currentRecording) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full w-full"
      >
        <Card className="h-full flex flex-col overflow-hidden bg-transparent py-0 shadow-xs">
          <div className="h-full flex items-center justify-center bg-muted/20">
            <div className="flex flex-col items-center gap-4 text-center">
              <Camera className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Recordings</h3>
              <p className="text-muted-foreground">No recordings available for this task</p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full"
    >
      <Card className="h-full flex flex-col overflow-hidden bg-transparent py-0 shadow-xs">
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center p-4 pb-2">
            <h3 className="text-lg font-medium">Screen Recording</h3>
            
            {recordings.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <List className="h-4 w-4" />
                    <span>{recordings.length} Recordings</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {recordings.map((recording) => (
                    <DropdownMenuItem
                      key={recording.id}
                      onClick={() => handleRecordingSelect(recording)}
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <Camera className="h-4 w-4" />
                      <span>
                        {format(new Date(recording.timestamp), "MMM d, h:mm a")}
                      </span>
                      {recording.id === currentRecording.id && (
                        <span className="ml-auto text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex-1 relative bg-black">
            <video
              ref={videoRef}
              src={currentRecording.videoUrl}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
            />
          </div>

          <div className="p-4 pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {format(new Date(currentRecording.timestamp), "PPpp")}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatTime(currentTime)} / {formatTime(currentRecording.duration)}
              </span>
            </div>

            <Slider
              value={[currentTime]}
              max={currentRecording.duration}
              step={0.1}
              onValueChange={handleSliderChange}
              className="w-full"
            />

            <div className="flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10"
                onClick={() => handleSkip(-10)}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                className="rounded-full h-10 w-10 hover:scale-105 transition-transform"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10"
                onClick={() => handleSkip(10)}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
