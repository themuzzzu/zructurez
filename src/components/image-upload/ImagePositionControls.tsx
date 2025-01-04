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
          onMouseDown={(e) => {
            e.preventDefault();
            const interval = setInterval(() => onPositionChange('up'), 50);
            const cleanup = () => {
              clearInterval(interval);
              window.removeEventListener('mouseup', cleanup);
            };
            window.addEventListener('mouseup', cleanup);
          }}
        >
          ↑
        </Button>
      </div>
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onMouseDown={(e) => {
            e.preventDefault();
            const interval = setInterval(() => onPositionChange('left'), 50);
            const cleanup = () => {
              clearInterval(interval);
              window.removeEventListener('mouseup', cleanup);
            };
            window.addEventListener('mouseup', cleanup);
          }}
        >
          ←
        </Button>
        <Button
          variant="outline"
          size="icon"
          onMouseDown={(e) => {
            e.preventDefault();
            const interval = setInterval(() => onPositionChange('down'), 50);
            const cleanup = () => {
              clearInterval(interval);
              window.removeEventListener('mouseup', cleanup);
            };
            window.addEventListener('mouseup', cleanup);
          }}
        >
          ↓
        </Button>
        <Button
          variant="outline"
          size="icon"
          onMouseDown={(e) => {
            e.preventDefault();
            const interval = setInterval(() => onPositionChange('right'), 50);
            const cleanup = () => {
              clearInterval(interval);
              window.removeEventListener('mouseup', cleanup);
            };
            window.addEventListener('mouseup', cleanup);
          }}
        >
          →
        </Button>
      </div>
    </div>
  );
};