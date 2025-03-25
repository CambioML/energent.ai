import { Upload, Plus, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface UploadedFile extends File {
  preview?: string;
}

export const UploadSection = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

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
      "image/*": [],
      "application/pdf": [],
      "text/plain": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
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

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const toastId = toast.loading("Uploading files...");

    // TODO: Replace with actual upload logic
    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // After successful upload, clear the files
      setFiles([]);

      // Success notification
      toast.success("Files uploaded successfully", { id: toastId });
    } catch (error) {
      // Error handling with toast notification
      toast.error("Upload failed: " + (error instanceof Error ? error.message : "Unknown error"), { id: toastId });
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="file-upload">
        <AccordionTrigger className="flex items-center gap-3 p-4 border-b">
          <Upload size={22} className="text-primary shrink-0" />
          <h3 className="text-lg font-medium">File Upload</h3>
        </AccordionTrigger>
        <AccordionContent>
          {files.length === 0 && (
            <div className="flex flex-col gap-4 p-4">
              <div
                {...getRootProps()}
                className={cn(
                  "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg w-full transition-colors duration-200 cursor-pointer",
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
                <p className="text-sm text-center mb-4">
                  {isDragActive
                    ? "Drop files here..."
                    : "Drag & drop files here or click to browse"}
                </p>
                <Button className="gap-2">
                  <Plus size={16} />
                  Select Files
                </Button>
              </div>
            </div>
          )}

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

              <div className="space-y-2 max-h-[10vh] overflow-y-auto pr-2">
                  {files.map((file, index) => (
                    <motion.div
                      key={`${file.name}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between p-2 bg-card rounded-md border"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        {file.preview ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="h-8 w-8 rounded object-cover"
                          />
                        ) : (
                          <FileText size={20} className="text-primary" />
                        )}
                        <span className="text-sm truncate">{file.name}</span>
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
                  ))}
              </div>

              <Button
                className="w-full mt-4"
                onClick={handleUpload}
                disabled={uploading || files.length === 0}
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
