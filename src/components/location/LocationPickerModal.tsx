
import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Compass, Locate, Search, X } from "lucide-react";
import { EnhancedLocationSelector } from "./EnhancedLocationSelector";
import { useGeolocation } from "@/hooks/useGeolocation";
import { isZructuresAvailable, handleLocationUpdate } from "@/utils/locationUtils";
import { Badge } from "@/components/ui/badge";

interface LocationPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  firstVisit?: boolean;
}

export function LocationPickerModal({ 
  open, 
  onOpenChange,
  firstVisit = false
}: LocationPickerModalProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>(
    localStorage.getItem("userLocation") || "All India"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const { requestGeolocation, loading, position, address } = useGeolocation();
  const [availabilityChecked, setAvailabilityChecked] = useState(!firstVisit);

  useEffect(() => {
    if (address) {
      const locationName = address.split(",")[0];
      setSelectedLocation(locationName);
    }
  }, [address]);
  
  // Update availability status when location changes
  useEffect(() => {
    if (selectedLocation !== "All India") {
      setAvailabilityChecked(true);
    }
  }, [selectedLocation]);

  const handleDetectLocation = async () => {
    setIsDetecting(true);
    requestGeolocation();
    setIsDetecting(false);
  };

  const handleConfirmLocation = () => {
    if (selectedLocation === "All India" && firstVisit) {
      // Force user to select a specific location on first visit
      return;
    }
    
    handleLocationUpdate(selectedLocation);
    onOpenChange(false);
  };

  const isAvailable = isZructuresAvailable(selectedLocation);

  return (
    <Dialog open={open} onOpenChange={firstVisit ? () => {} : onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {firstVisit ? "Welcome! Choose your location" : "Change your location"}
          </DialogTitle>
          <DialogDescription>
            {firstVisit 
              ? "Let us know where you're browsing from to show relevant content."
              : "Update your location to see businesses and services in your area."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Your location</div>
              {!firstVisit && (
                <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={handleDetectLocation}
                disabled={loading}
              >
                {loading || isDetecting ? (
                  <Locate className="h-4 w-4 animate-spin" />
                ) : (
                  <Compass className="h-4 w-4" />
                )}
                {loading || isDetecting 
                  ? "Detecting your location..." 
                  : "Detect my current location"}
              </Button>
            </div>
            
            <div>
              <EnhancedLocationSelector 
                value={selectedLocation}
                onChange={setSelectedLocation}
                className="w-full"
                showDetect={false}
              />
            </div>
            
            {availabilityChecked && selectedLocation !== "All India" && (
              <div className={`rounded-lg p-3 ${
                isAvailable 
                  ? "bg-green-50 border border-green-100 dark:bg-green-900/20 dark:border-green-900/30" 
                  : "bg-amber-50 border border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/30"
              }`}>
                <div className="flex items-center gap-2">
                  <Badge variant={isAvailable ? "success" : "warning"} className="h-2 w-2 rounded-full p-0" />
                  <span className={`text-sm ${
                    isAvailable ? "text-green-700 dark:text-green-400" : "text-amber-700 dark:text-amber-400"
                  }`}>
                    {isAvailable 
                      ? `Zructures is available in ${selectedLocation}!` 
                      : `Zructures is not yet available in ${selectedLocation}`}
                  </span>
                </div>
                {!isAvailable && (
                  <p className="text-xs text-muted-foreground mt-1">
                    We're expanding rapidly! We'll let you browse but some features might be limited.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="default" 
            onClick={handleConfirmLocation} 
            className="w-full sm:w-auto"
            disabled={selectedLocation === "All India" && firstVisit}
          >
            Confirm Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
