import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { MapPin, Search } from "lucide-react";
import { Input } from "../ui/input";
import { MapDisplay } from "./MapDisplay";

interface MapLocationSelectorProps {
  value: string;
  onChange: (location: string) => void;
}

export const MapLocationSelector = ({ value, onChange }: MapLocationSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>(value);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const handleGoogleMapsLoaded = () => {
      console.log('Maps loaded event received');
      setIsLoading(false);
    };

    if (window.google?.maps) {
      console.log('Maps already loaded');
      setIsLoading(false);
    }

    window.addEventListener('google-maps-loaded', handleGoogleMapsLoaded);
    
    return () => {
      window.removeEventListener('google-maps-loaded', handleGoogleMapsLoaded);
    };
  }, []);

  const handleConfirm = () => {
    onChange(selectedLocation);
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
        {value || "Select location from map..."}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Select Location</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location-search"
                type="text"
                placeholder="Search for a location..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>

            <MapDisplay 
              onLocationSelect={setSelectedLocation}
              searchInput={searchInput}
            />
          </div>

          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedLocation || "Click or drag the marker on the map to select a location"}
            </div>
            <Button onClick={handleConfirm}>Confirm Location</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};