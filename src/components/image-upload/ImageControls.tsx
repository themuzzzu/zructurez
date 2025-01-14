import { Slider } from "../ui/slider";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

interface ImageControlsProps {
  scale: number;
  onScaleChange: (scale: number) => void;
  onPositionChange: (x: number, y: number) => void;
  onSave?: () => void;
}

export const ImageControls = ({
  scale,
  onScaleChange,
  onPositionChange,
  onSave,
}: ImageControlsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Zoom</Label>
        <Slider
          value={[scale]}
          min={0.1}
          max={2}
          step={0.1}
          onValueChange={(value) => onScaleChange(value[0])}
        />
      </div>
      {onSave && (
        <Button onClick={onSave} className="w-full">
          Save Changes
        </Button>
      )}
    </div>
  );
};