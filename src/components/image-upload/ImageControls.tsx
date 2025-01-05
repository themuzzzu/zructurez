import { ImageZoomControl } from "./ImageZoomControl";
import { ImagePositionControls } from "./ImagePositionControls";
import { Button } from "../ui/button";

interface ImagePosition {
  x: number;
  y: number;
}

interface ImageControlsProps {
  scale: number;
  onScaleChange: (scale: number) => void;
  onPositionChange: (x: number, y: number) => void;
  onSave: () => void;
}

export const ImageControls = ({
  scale,
  onScaleChange,
  onPositionChange,
  onSave,
}: ImageControlsProps) => {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <ImageZoomControl scale={scale} onScaleChange={onScaleChange} />
      <ImagePositionControls onPositionChange={onPositionChange} />
      <Button 
        className="w-full" 
        onClick={onSave}
      >
        Apply Changes
      </Button>
    </div>
  );
};