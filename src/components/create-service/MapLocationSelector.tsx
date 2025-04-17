
import { useState, useEffect, useRef, memo } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { MapPin } from "lucide-react";
import { Input } from "../ui/input";
import { MapDisplay } from "./MapDisplay";
import { Label } from "../ui/label";

interface MapLocationSelectorProps {
  value: string;
  onChange: (location: string) => void;
}

export const MapLocationSelector = ({ value, onChange }: MapLocationSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>(value);
  const [isLoading, setIsLoading] = useState(true);
  const [manualLocation, setManualLocation] = useState(value);
  const mapLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set a timeout to consider the map loaded after a reasonable amount of time
    // This prevents infinite loading states if the Google Maps event never fires
    mapLoadTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    const handleGoogleMapsLoaded = () => {
      setIsLoading(false);
      if (mapLoadTimeoutRef.current) {
        clearTimeout(mapLoadTimeoutRef.current);
      }
    };

    if (window.google?.maps) {
      setIsLoading(false);
      if (mapLoadTimeoutRef.current) {
        clearTimeout(mapLoadTimeoutRef.current);
      }
    }

    window.addEventListener('google-maps-loaded', handleGoogleMapsLoaded);
    
    return () => {
      window.removeEventListener('google-maps-loaded', handleGoogleMapsLoaded);
      if (mapLoadTimeoutRef.current) {
        clearTimeout(mapLoadTimeoutRef.current);
      }
    };
  }, []);

  // Use a smaller handler to improve performance
  const handleConfirm = () => {
    const finalLocation = manualLocation || selectedLocation;
    onChange(finalLocation);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start gap-2"
        onClick={() => setIsOpen(true)}
      >
        <MapPin className="h-4 w-4" />
        {value || "Select or type location..."}
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          // Clean up resources when dialog is closed
          setSelectedLocation(value);
          setManualLocation(value);
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Select Location</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="manual-location">Enter Location</Label>
              <Input
                id="manual-location"
                type="text"
                placeholder="Type your location..."
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Only render MapDisplay when dialog is open to save resources */}
            {isOpen && (
              <div className="space-y-2">
                <Label>Or select from map</Label>
                <MapDisplay 
                  onLocationSelect={setSelectedLocation}
                  searchInput=""
                />
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedLocation || manualLocation || "Enter location or select from map"}
            </div>
            <Button onClick={handleConfirm}>Confirm Location</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Export memoized version to prevent unnecessary re-renders
export default memo(MapLocationSelector);
