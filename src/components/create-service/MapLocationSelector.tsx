
import { useState, useEffect, useRef, memo } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { MapPin, AlertCircle } from "lucide-react";
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
  const [manualLocation, setManualLocation] = useState(value);
  const [searchInput, setSearchInput] = useState("");
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const isMobileDevice = useRef(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      isMobileDevice.current = window.innerWidth < 768;
    };
    window.addEventListener('resize', handleResize);
    
    // Check location permission status
    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" as PermissionName })
        .then(permissionStatus => {
          setLocationPermission(permissionStatus.state as 'granted' | 'denied' | 'prompt');
          
          // Listen for changes to permission status
          permissionStatus.onchange = function() {
            setLocationPermission(this.state as 'granted' | 'denied' | 'prompt');
          };
        })
        .catch(() => {
          setLocationPermission('unknown');
        });
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update manual location input when value changes from outside
  useEffect(() => {
    setManualLocation(value);
  }, [value]);

  const handleConfirm = () => {
    // Prioritize manual location input
    const finalLocation = manualLocation || selectedLocation;
    onChange(finalLocation);
    setIsOpen(false);
    
    // Update search input for the map display
    if (finalLocation) {
      setSearchInput(finalLocation);
    }
  };

  // Handle manual location change
  const handleManualLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualLocation(e.target.value);
  };

  // Handle search button click
  const handleSearchLocation = () => {
    if (manualLocation.trim()) {
      setSearchInput(manualLocation);
    }
  };
  
  const requestLocationPermission = () => {
    if (!navigator.geolocation) return;
    
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationPermission('granted');
      },
      () => {
        setLocationPermission('denied');
      }
    );
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
          // Reset state when dialog is closed
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
              <div className="flex gap-2">
                <Input
                  id="manual-location"
                  type="text"
                  placeholder="Type your location..."
                  value={manualLocation}
                  onChange={handleManualLocationChange}
                  className="w-full"
                  autoFocus={!isMobileDevice.current}
                />
                <Button type="button" onClick={handleSearchLocation}>
                  Search
                </Button>
              </div>
              
              {isMobileDevice.current && locationPermission === 'denied' && (
                <div className="flex items-center gap-2 text-amber-600 mt-2 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>Location access denied. Manual entry only.</span>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                {isMobileDevice.current ? 
                  locationPermission === 'granted' ?
                    "You can type your location or select from the map below" :
                    "Allow location access for better map functionality" : 
                  "For best performance, please enter your location manually"}
              </p>
              
              {isMobileDevice.current && locationPermission === 'denied' && (
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={requestLocationPermission}
                >
                  Allow Location Access
                </Button>
              )}
            </div>

            {/* Only render MapDisplay when dialog is open to save resources */}
            {isOpen && (
              <div className="space-y-2">
                <Label>Or select from map</Label>
                <MapDisplay 
                  onLocationSelect={setSelectedLocation}
                  searchInput={searchInput}
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
