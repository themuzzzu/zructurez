import { Move } from "lucide-react";

interface ImagePositionControlsProps {
  onPositionChange: (x: number, y: number) => void;
}

export const ImagePositionControls = ({ onPositionChange }: ImagePositionControlsProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Move className="h-4 w-4" />
        <span className="text-sm">Position (drag image to adjust)</span>
      </div>
    </div>
  );
};