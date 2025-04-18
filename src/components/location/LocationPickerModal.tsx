import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Compass, Locate, Search, X } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { isZructuresAvailable, handleLocationUpdate } from "@/utils/locationUtils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const locations = [
    "Tadipatri",
    "Anantapur",
    "Dharmavaram",
    "Kadapa",
    "Kurnool",
    "Delhi",
    "Mumbai",
    "Bengaluru",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Jaipur"
  ];
  
  const [filteredLocations, setFilteredLocations] = useState(locations);

  useEffect(() => {
    if (address) {
      const locationName = address.split(",")[0];
      setSelectedLocation(locationName);
    }
  }, [address]);
  
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLocations(locations);
    } else {
      const filtered = locations.filter(location => 
        location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchQuery]);
  
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
      return;
    }
    
    handleLocationUpdate(selectedLocation);
    onOpenChange(false);
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setTimeout(() => handleConfirmLocation(), 100);
  };

  const isAvailable = isZructuresAvailable(selectedLocation);

  return (
    <Dialog open={open} onOpenChange={firstVisit ? () => {} : onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-4 sm:p-6 fixed w-[95%] max-h-[90vh] overflow-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl font-semibold">
            <MapPin className="h-6 w-6" />
            Choose your location
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2"
            onClick={handleDetectLocation}
            disabled={loading}
            size="lg"
          >
            <Locate className="h-5 w-5" />
            {loading || isDetecting ? "Detecting Your Location..." : "Detect My Location"}
          </Button>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search city or town"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <ScrollArea className="h-[40vh] sm:h-[50vh]">
            <div className="space-y-1 pr-4">
              <h3 className="text-lg font-medium mb-2">Or select a city or town</h3>
              <div className="space-y-2">
                {filteredLocations.map((location) => {
                  const isLocationAvailable = isZructuresAvailable(location);
                  
                  return (
                    <div key={location} className="space-y-1">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => handleLocationSelect(location)}
                      >
                        <MapPin className="h-4 w-4 mr-2 shrink-0 text-muted-foreground" />
                        <span className="truncate">{location}</span>
                      </Button>
                      
                      {selectedLocation === location && !isLocationAvailable && (
                        <div className="rounded-md p-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 ml-6">
                          <div className="flex gap-2 items-start">
                            <span className="text-amber-500 mt-0.5">⚠</span>
                            <div>
                              <p className="font-medium">Zructures is not yet available in {location}</p>
                              <p className="text-sm opacity-80">We're expanding rapidly! You'll still be able to browse but some features might be limited.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
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
