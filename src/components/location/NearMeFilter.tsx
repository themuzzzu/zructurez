
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Navigation } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useGeolocation } from "@/hooks/useGeolocation";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface NearMeFilterProps {
  onFilterChange: (filter: {enabled: boolean, radius: number}) => void;
  className?: string;
  defaultRadius?: number;
  compact?: boolean;
}

export function NearMeFilter({
  onFilterChange,
  className = "",
  defaultRadius = 5,
  compact = false
}: NearMeFilterProps) {
  const [enabled, setEnabled] = useState(false);
  const [radius, setRadius] = useState(defaultRadius);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { requestGeolocation, loading, position } = useGeolocation();
  
  useEffect(() => {
    if (enabled && !position) {
      requestGeolocation();
    }
  }, [enabled, position]);
  
  useEffect(() => {
    onFilterChange({ enabled, radius });
  }, [enabled, radius, onFilterChange]);
  
  const toggleFilter = () => {
    if (!enabled && !position) {
      requestGeolocation();
    }
    
    setEnabled(!enabled);
    
    if (!enabled) {
      toast.success(`Showing items within ${radius}km of your location`);
    }
  };
  
  if (compact) {
    return (
      <Button
        variant={enabled ? "default" : "outline"}
        size="sm"
        className={`${className} ${enabled ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        onClick={toggleFilter}
        disabled={loading}
      >
        {loading ? (
          <Navigation className="h-3.5 w-3.5 mr-1 animate-spin" />
        ) : (
          <MapPin className="h-3.5 w-3.5 mr-1" />
        )}
        Near Me
      </Button>
    );
  }
  
  return (
    <div className={className}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={enabled ? "default" : "outline"}
                  size="sm"
                  className={enabled ? "bg-primary text-primary-foreground" : "text-muted-foreground"}
                  disabled={loading}
                >
                  {loading ? (
                    <Navigation className="h-4 w-4 mr-1.5 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4 mr-1.5" />
                  )}
                  Near Me
                  {enabled && (
                    <Badge variant="secondary" className="ml-1.5 bg-primary-foreground text-primary">
                      {radius}km
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-4">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-medium">Distance Filter</h4>
                    <p className="text-xs text-muted-foreground">
                      Show content within {radius}km of your location
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>1km</span>
                      <span>50km</span>
                    </div>
                    <Slider
                      value={[radius]}
                      min={1}
                      max={50}
                      step={1}
                      onValueChange={(values) => setRadius(values[0])}
                    />
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEnabled(false);
                        setPopoverOpen(false);
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setEnabled(true);
                        setPopoverOpen(false);
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </TooltipTrigger>
          <TooltipContent>
            <p>Filter content based on your location</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
