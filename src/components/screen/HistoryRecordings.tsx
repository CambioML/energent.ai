import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, Eye, Film, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// This would be defined elsewhere, just mocking for now
interface Recording {
  id: string;
  name: string;
  date: string;
  duration: string;
  thumbnail?: string;
}

interface HistoryRecordingsProps {
  onSelectRecording?: (recordingId: string) => void;
}

export default function HistoryRecordings({ onSelectRecording }: HistoryRecordingsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data - would be replaced with actual API calls
  const [recordings, setRecordings] = useState<Recording[]>([
    { id: "1", name: "Recording 1", date: "2023-05-15", duration: "1m 30s" },
    { id: "2", name: "Recording 2", date: "2023-05-14", duration: "2m 45s" },
    { id: "3", name: "Recording 3", date: "2023-05-12", duration: "5m 20s" },
  ]);

  // Filter recordings based on search term
  const filteredRecordings = recordings.filter(recording => 
    recording.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Film className="h-5 w-5" />
          Recording History
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recordings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[calc(100vh-250px)] overflow-y-auto pr-2">
          <div className="space-y-2">
            {filteredRecordings.length > 0 ? (
              filteredRecordings.map((recording) => (
                <div 
                  key={recording.id}
                  className="p-3 rounded-md hover:bg-muted/50 cursor-pointer transition-colors group"
                  onClick={() => onSelectRecording?.(recording.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {recording.thumbnail ? (
                        <img 
                          src={recording.thumbnail} 
                          alt={recording.name} 
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                          <Film className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-sm">{recording.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {recording.date}
                          </span>
                          <span>•</span>
                          <span>{recording.duration}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRecording?.(recording.id);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                No recordings found
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 