
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Navigation, MapPin, Check } from "lucide-react";
import { useLocation } from "@/providers/LocationProvider";

interface NearMeFilterProps {
  onFilterChange: (filter: { enabled: boolean; radius: number }) => void;
  compact?: boolean;
}

export function NearMeFilter({ 
  onFilterChange,
  compact = false 
}: NearMeFilterProps) {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [radius, setRadius] = useState(5); // Default radius in km
  const { isDetectingLocation, detectLocation } = useLocation();
  
  const handleEnableClick = () => {
    const newEnabledState = !enabled;
    setEnabled(newEnabledState);
    onFilterChange({ enabled: newEnabledState, radius });
    
    // Automatically detect location when enabling
    if (newEnabledState) {
      detectLocation();
    }
  };
  
  const handleRadiusChange = (value: number[]) => {
    const newRadius = value[0];
    setRadius(newRadius);
    if (enabled) {
      onFilterChange({ enabled, radius: newRadius });
    }
  };
  
  if (compact) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={enabled ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-1.5"
          >
            {isDetectingLocation ? (
              <Navigation className="h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Near Me</span>
            {enabled && <Check className="h-3 w-3 ml-1" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Near Me Filter</h4>
              <Button
                variant={enabled ? "default" : "outline"}
                size="sm"
                onClick={handleEnableClick}
              >
                {enabled ? "Enabled" : "Disabled"}
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Radius: {radius} km</span>
              </div>
              <Slider
                defaultValue={[radius]}
                max={25}
                min={1}
                step={1}
                onValueChange={handleRadiusChange}
                disabled={!enabled}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
  
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          Near Me
        </h3>
        <Button
          variant={enabled ? "default" : "outline"}
          size="sm"
          onClick={handleEnableClick}
        >
          {enabled ? "Enabled" : "Disabled"}
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Radius: {radius} km</span>
        </div>
        <Slider
          defaultValue={[radius]}
          max={25}
          min={1}
          step={1}
          onValueChange={handleRadiusChange}
          disabled={!enabled}
        />
      </div>
    </div>
  );
}
