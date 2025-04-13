
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Check, MapPin, Navigation, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NearMeFilterProps {
  onFilterChange: (filter: { enabled: boolean; radius: number }) => void;
  compact?: boolean;
}

export function NearMeFilter({ onFilterChange, compact = false }: NearMeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [radius, setRadius] = useState(5);

  const handleToggle = (enabled: boolean) => {
    setIsEnabled(enabled);
    onFilterChange({ enabled, radius });
    // Close popover when disabling filter
    if (!enabled) setIsOpen(false);
  };

  const handleRadiusChange = (value: number[]) => {
    const newRadius = value[0];
    setRadius(newRadius);
    onFilterChange({ enabled: isEnabled, radius: newRadius });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={isEnabled ? "default" : "outline"}
          size={compact ? "sm" : "default"}
          className={`gap-2 ${isEnabled ? "" : "border-dashed"}`}
        >
          <MapPin className={`h-4 w-4 ${compact ? "mr-0" : "mr-1"}`} />
          {compact ? null : "Near Me"}
          {isEnabled && <span className="font-normal">({radius}km)</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Near Me Filter</h4>
            <Button
              variant={isEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => handleToggle(!isEnabled)}
            >
              {isEnabled ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-2" /> Enabled
                </>
              ) : (
                <>
                  <X className="h-3.5 w-3.5 mr-2" /> Disabled
                </>
              )}
            </Button>
          </div>

          <ScrollArea className="h-full max-h-[300px] pr-4">
            <div className="space-y-6 py-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Distance Radius</span>
                  <span className="text-sm font-medium">{radius} km</span>
                </div>
                <Slider
                  disabled={!isEnabled}
                  value={[radius]}
                  min={1}
                  max={50}
                  step={1}
                  onValueChange={handleRadiusChange}
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Navigation className="h-3.5 w-3.5" />
                <span>
                  Shows businesses and services within {radius}km of your current
                  location
                </span>
              </div>

              <div className="flex justify-between pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  disabled={!isEnabled}
                  onClick={() => setIsOpen(false)}
                >
                  Apply Filter
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
