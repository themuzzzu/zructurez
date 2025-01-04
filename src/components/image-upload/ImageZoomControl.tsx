import { Slider } from "../ui/slider";
import { ZoomIn } from "lucide-react";

interface ImageZoomControlProps {
  scale: number;
  onScaleChange: (value: number) => void;
}

export const ImageZoomControl = ({ scale, onScaleChange }: ImageZoomControlProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <ZoomIn className="h-4 w-4" />
        <span className="text-sm">Zoom</span>
      </div>
      <Slider
        value={[scale * 100]}
        onValueChange={(value) => onScaleChange(value[0] / 100)}
        min={100}
        max={200}
        step={5}
      />
    </div>
  );
};