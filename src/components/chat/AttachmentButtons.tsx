import { Camera, Image, FileText, Users, MessageSquare, BarChart2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AttachmentButtonsProps {
  onAttachment: (type: string) => void;
}

export const AttachmentButtons = ({ onAttachment }: AttachmentButtonsProps) => {
  return (
    <div className="flex gap-2 mb-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onAttachment("photo")}
      >
        <Image className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onAttachment("camera")}
      >
        <Camera className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onAttachment("document")}
      >
        <FileText className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onAttachment("contact")}
      >
        <Users className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onAttachment("poll")}
      >
        <BarChart2 className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onAttachment("drawing")}
      >
        <Pencil className="h-5 w-5" />
      </Button>
    </div>
  );
};