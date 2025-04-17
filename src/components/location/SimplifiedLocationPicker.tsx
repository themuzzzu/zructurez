
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
import { useLanguage } from "@/contexts/LanguageContext";

interface SimplifiedLocationPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  firstVisit?: boolean;
}

export function SimplifiedLocationPicker({ 
  open, 
  onOpenChange,
  firstVisit = false
}: SimplifiedLocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>(
    localStorage.getItem("userLocation") || "All India"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const { requestGeolocation, loading, position, address } = useGeolocation();
  const [availabilityChecked, setAvailabilityChecked] = useState(!firstVisit);
  const { t } = useLanguage();

  // Sample locations based on the image
  const locations = [
    "Tadipatri",
    "Anantapur",
    "Dharmavaram",
    "Kadapa",
    "Kurnool",
    // Add more from image 1
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
  
  // Filter locations when search query changes
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

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setTimeout(() => handleConfirmLocation(), 100);
  };

  const isAvailable = isZructuresAvailable(selectedLocation);

  return (
    <Dialog open={open} onOpenChange={firstVisit ? () => {} : onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6 bg-zinc-900 text-white border-zinc-800 fixed max-h-[90vh] overflow-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2 text-2xl font-semibold text-white">
            <MapPin className="h-7 w-7" />
            {t("chooseYourLocation")}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Detect Location Button */}
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white"
            onClick={handleDetectLocation}
            disabled={loading}
            size="lg"
          >
            <Locate className="h-5 w-5" />
            {loading || isDetecting ? t("detectingYourLocation") : t("detectMyLocation")}
          </Button>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input
              placeholder={t("searchCityOrTown")}
              className="pl-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Location List */}
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-white mb-2">{t("orSelectCityOrTown")}</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {filteredLocations.map((location) => {
                const isLocationAvailable = isZructuresAvailable(location);
                
                return (
                  <div key={location} className="space-y-1">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left text-white hover:bg-zinc-800 h-auto py-2"
                      onClick={() => handleLocationSelect(location)}
                    >
                      <MapPin className="h-4 w-4 mr-2 text-zinc-400" />
                      <span>{location}</span>
                    </Button>
                    
                    {/* Availability Message - Show only for the selected location */}
                    {selectedLocation === location && !isLocationAvailable && (
                      <div className="rounded-md p-3 bg-amber-900/30 border border-amber-800/40 text-amber-300 ml-6">
                        <div className="flex gap-2 items-start">
                          <span className="text-amber-300 mt-0.5">⚠</span>
                          <div>
                            <p className="font-medium">{t("notAvailableIn").replace("{location}", location)}</p>
                            <p className="text-sm text-amber-400/80">{t("expandingRapidly")}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button 
            variant="default" 
            onClick={handleConfirmLocation} 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            disabled={selectedLocation === "All India" && firstVisit}
          >
            {t("confirmLocation")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
