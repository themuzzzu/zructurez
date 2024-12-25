import { useState, useEffect } from "react";
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

  useEffect(() => {
    const handleGoogleMapsLoaded = () => {
      setIsLoading(false);
    };

    if (window.google?.maps) {
      setIsLoading(false);
    }

    window.addEventListener('google-maps-loaded', handleGoogleMapsLoaded);
    
    return () => {
      window.removeEventListener('google-maps-loaded', handleGoogleMapsLoaded);
    };
  }, []);

  const handleConfirm = () => {
    // Use either the map-selected location or manual input
    const finalLocation = manualLocation || selectedLocation;
    onChange(finalLocation);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start gap-2"
        disabled
      >
        <MapPin className="h-4 w-4" />
        Loading map...
      </Button>
    );
  }

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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

            <div className="space-y-2">
              <Label>Or select from map</Label>
              <MapDisplay 
                onLocationSelect={setSelectedLocation}
                searchInput=""
              />
            </div>
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