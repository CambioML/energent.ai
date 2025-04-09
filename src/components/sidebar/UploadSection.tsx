import { Upload, Plus, FileText, X, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useSidebarStore } from "@/lib/store/useSidebarStore";
import { ChatAPI } from "@/lib/api/chat-api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAgentStore } from "@/lib/store/useAgentStore";
interface UploadedFile extends File {
  preview?: string;
}

// Allowed file extensions from the API
const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "txt", "png", "jpg", "jpeg", "csv"];
// Max file size from the API (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const UploadSection = () => {
  const { agentId } = useAgentStore();
  const { expandedAccordions, toggleAccordion } = useSidebarStore();

  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Create preview URLs for image files
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      })
    );

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    onDropRejected: (fileRejections) => {
      console.error("Dropzone error:", fileRejections);
      toast.error("Error uploading files: " + (fileRejections[0].errors[0].message));
    },
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "text/csv": [".csv"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxSize: MAX_FILE_SIZE,
  });

  const removeFile = (index: number) => {
    setFiles((files) => {
      const newFiles = [...files];
      // Revoke the preview URL to avoid memory leaks
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const validateFileType = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    return ALLOWED_EXTENSIONS.includes(ext);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    if (!agentId) {
      toast.error("Agent ID is required for upload");
      return;
    }

    setUploading(true);
    const toastId = toast.loading(`Uploading ${files.length} files...`);

    try {
      // Track successful and failed uploads
      let successCount = 0;
      let failCount = 0;

      // Upload each file
      for (const file of files) {
        // Validate file type
        if (!validateFileType(file)) {
          toast.error(`Invalid file type: ${file.name}. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`);
          failCount++;
          continue;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`File too large: ${file.name}. Maximum size: 10MB`);
          failCount++;
          continue;
        }

        // Upload the file
        const result = await ChatAPI.uploadFile(file, agentId);
        
        if (result.success) {
          successCount++;
        } else {
          failCount++;
          console.error(`Failed to upload ${file.name}: ${result.message}`);
        }
      }

      // Clear files after upload attempt
      setFiles([]);

      // Show appropriate notification
      if (successCount > 0 && failCount === 0) {
        toast.success(`Successfully uploaded ${successCount} file(s)`, { id: toastId });
      } else if (successCount > 0 && failCount > 0) {
        toast.success(`Uploaded ${successCount} file(s), ${failCount} failed`, { id: toastId });
      } else {
        toast.error(`Failed to upload files`, { id: toastId });
      }
    } catch (error) {
      toast.error("Upload failed: " + (error instanceof Error ? error.message : "Unknown error"), { id: toastId });
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Accordion 
      type="single" 
      collapsible 
      className="w-full" 
      defaultValue={expandedAccordions.upload ? "upload" : undefined}
      onValueChange={(value) => {
        if (value === "upload" || value === undefined) {
          toggleAccordion("upload");
        }
      }}
    >
      <AccordionItem value="upload" className="border-0">
        <div className="flex items-center gap-3 p-4 border-b">
          <Upload size={20} className="shrink-0" />
          <AccordionTrigger className="flex-1 flex justify-center items-center p-0 hover:no-underline">
            <h3 className="text-lg font-medium">File Upload</h3>
          </AccordionTrigger>
        </div>
        <AccordionContent>
          <div className="flex flex-col gap-4 p-4">
            <div
              {...getRootProps()}
              className={cn(
                "flex flex-col items-center justify-center p-4 border-1 border-dashed border-primary/60 rounded-lg w-full transition-colors duration-200 cursor-pointer",
                isDragActive && "border-primary bg-primary/5",
                isDragAccept && "border-green-500 bg-green-500/5",
                isDragReject && "border-red-500 bg-red-500/5"
              )}
            >
              <input {...getInputProps()} />
              <Upload
                size={22}
                className={cn(
                  "mb-2",
                  isDragActive ? "text-primary animate-bounce" : "text-primary"
                )}
              />
              <p className="text-sm text-center mb-2">
                {isDragActive
                  ? "Drop files here..."
                  : "Drag & drop files here or click to browse"}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Supported formats: PDF, DOC, DOCX, CSV, TXT, PNG, JPG, JPEG (max 10MB)
              </p>
              <Button className="gap-2">
                <Plus size={16} />
                Select Files
              </Button>
            </div>
          </div>

          {files.length > 0 && (
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Files ({files.length})</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiles([])}
                  disabled={uploading}
                >
                  Clear All
                </Button>
              </div>

              <div className="space-y-2 pr-2">
                  {files.map((file, index) => {
                    const isValidType = validateFileType(file);
                    const isValidSize = file.size <= MAX_FILE_SIZE;
                    const isValid = isValidType && isValidSize;
                    
                    return (
                      <motion.div
                        key={`${file.name}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "flex items-center justify-between p-2 bg-card rounded-md border",
                          !isValid && "border-red-500 bg-red-50 dark:bg-red-950/20"
                        )}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          {file.preview ? (
                            <img
                              src={file.preview}
                              alt={file.name}
                              className="h-8 w-8 rounded object-cover"
                            />
                          ) : isValid ? (
                            <FileText size={20} className="" />
                          ) : (
                            <FileWarning size={20} className="text-red-500" />
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm truncate">{file.name}</span>
                            {!isValid && (
                              <span className="text-xs text-red-500">
                                {!isValidType && "Invalid file type"}
                                {!isValidSize && "File too large (max 10MB)"}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          disabled={uploading}
                          className="h-7 w-7"
                        >
                          <X size={14} />
                        </Button>
                      </motion.div>
                    );
                  })}
              </div>

              <Button
                className="w-full mt-4"
                onClick={handleUpload}
                disabled={uploading || files.length === 0 || !agentId}
              >
                {uploading ? "Uploading..." : "Upload Files"}
              </Button>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
