import { Button } from "../ui/button";
import { Move } from "lucide-react";

interface ImagePositionControlsProps {
  onPositionChange: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export const ImagePositionControls = ({ onPositionChange }: ImagePositionControlsProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Move className="h-4 w-4" />
        <span className="text-sm">Position</span>
      </div>
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPositionChange('up')}
        >
          ↑
        </Button>
      </div>
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPositionChange('left')}
        >
          ←
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPositionChange('down')}
        >
          ↓
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPositionChange('right')}
        >
          →
        </Button>
      </div>
    </div>
  );
};