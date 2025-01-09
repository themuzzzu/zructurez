import { Button } from "../ui/button";
import { X } from "lucide-react";

interface ImagePosition {
  x: number;
  y: number;
}

interface ImagePreviewProps {
  previewImage: string;
  scale: number;
  position: ImagePosition;
  onPositionChange: (position: ImagePosition) => void;
  onImageRemove: () => void;
  isDragging: boolean;
  onDragStart: (e: React.MouseEvent) => void;
  onDragMove: (e: React.MouseEvent) => void;
  onDragEnd: () => void;
}

export const ImagePreview = ({
  previewImage,
  scale,
  position,
  onPositionChange,
  onImageRemove,
  isDragging,
  onDragStart,
  onDragMove,
  onDragEnd,
}: ImagePreviewProps) => {
  return (
    <div 
      className="relative h-48 overflow-hidden rounded-lg group cursor-move"
      onMouseDown={onDragStart}
      onMouseMove={onDragMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
    >
      <img
        src={previewImage}
        alt="Preview"
        className="w-full h-full object-cover transition-transform duration-300"
        style={{
          transform: `scale(${scale})`,
          objectPosition: `${position.x}% ${position.y}%`,
          userSelect: 'none',
          pointerEvents: 'none'
        }}
      />
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={onImageRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};