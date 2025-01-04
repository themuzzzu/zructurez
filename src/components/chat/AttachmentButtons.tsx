import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Camera, Image, FileText, Users, BarChart2, Pencil, Video } from "lucide-react";

interface AttachmentButtonsProps {
  onAttachment: (type: string) => void;
}

export const AttachmentButtons = ({ onAttachment }: AttachmentButtonsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-accent hover:text-accent-foreground"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => onAttachment("photo")}>
          <Image className="mr-2 h-4 w-4" />
          <span>Photo</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAttachment("video")}>
          <Video className="mr-2 h-4 w-4" />
          <span>Video</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAttachment("camera")}>
          <Camera className="mr-2 h-4 w-4" />
          <span>Camera</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAttachment("document")}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Document</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAttachment("contact")}>
          <Users className="mr-2 h-4 w-4" />
          <span>Contact</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAttachment("poll")}>
          <BarChart2 className="mr-2 h-4 w-4" />
          <span>Poll</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAttachment("drawing")}>
          <Pencil className="mr-2 h-4 w-4" />
          <span>Drawing</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};