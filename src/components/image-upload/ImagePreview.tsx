
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { ImagePosition } from "./types/index";

interface ImagePreviewProps {
  previewImage: string;
  scale: number;
  position: ImagePosition;
  onImageRemove: () => void;
  isDragging: boolean;
  onDragStart: (e: React.MouseEvent) => void;
  onDragMove: (e: React.MouseEvent) => void;
  onDragEnd: () => void;
  onPositionChange: (position: ImagePosition) => void;
}

export const ImagePreview = ({
  previewImage,
  scale,
  position,
  onImageRemove,
  isDragging,
  onDragStart,
  onDragMove,
  onDragEnd,
  onPositionChange,
}: ImagePreviewProps) => {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${scale})`,
          backgroundImage: `url(${previewImage})`,
          backgroundPosition: `${position.x}% ${position.y}%`,
          backgroundSize: "cover",
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
      />
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute right-2 top-2"
        onClick={onImageRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
