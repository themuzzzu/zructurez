import { useState } from "react";
import { Button } from "../ui/button";
import { FileText } from "lucide-react";
import { toast } from "sonner";

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain"
];

interface DocumentUploadProps {
  onDocumentUpload: (file: File) => Promise<void>;
}

export const DocumentUpload = ({ onDocumentUpload }: DocumentUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast.error("Please upload a valid document file (PDF, DOC, DOCX, or TXT)");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Document size should be less than 10MB");
      return;
    }

    try {
      setIsUploading(true);
      await onDocumentUpload(file);
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2"
          disabled={isUploading}
          onClick={() => document.getElementById('document-upload')?.click()}
        >
          <FileText className="h-4 w-4" />
          {isUploading ? "Uploading..." : "Choose Document"}
        </Button>
        <input
          id="document-upload"
          type="file"
          accept={ACCEPTED_FILE_TYPES.join(',')}
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};