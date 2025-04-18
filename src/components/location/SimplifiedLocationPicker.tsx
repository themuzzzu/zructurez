
import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Compass, Locate, Search } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { isZructuresAvailable, handleLocationUpdate } from "@/utils/locationUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-900 text-white border-zinc-800 max-h-[90vh] overflow-y-auto sm:rounded-xl shadow-lg w-full sm:w-[95%] sm:max-w-[500px] p-4 sm:p-6 z-[9999]">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl font-semibold text-white">
            <MapPin className="h-6 w-6" />
            {t("chooseYourLocation")}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Select your location to find nearby services
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white h-12"
            onClick={handleDetectLocation}
            disabled={loading}
          >
            <Locate className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
            {loading || isDetecting ? t("detectingYourLocation") : t("detectMyLocation")}
          </Button>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input
              placeholder={t("searchCityOrTown")}
              className="pl-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <ScrollArea className="h-[40vh] pr-4">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-white mb-2">{t("orSelectCityOrTown")}</h3>
              <div className="space-y-2">
                {filteredLocations.map((location) => {
                  const isLocationAvailable = isZructuresAvailable(location);
                  
                  return (
                    <div key={location} className="space-y-1">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-left text-white hover:bg-zinc-800 h-auto py-3"
                        onClick={() => handleLocationSelect(location)}
                      >
                        <MapPin className="h-4 w-4 mr-2 text-zinc-400 shrink-0" />
                        <span className="truncate">{location}</span>
                      </Button>
                      
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
          </ScrollArea>
        </div>

        <DialogFooter className="mt-6">
          <Button 
            variant="default" 
            onClick={handleConfirmLocation} 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 h-12"
            disabled={selectedLocation === "All India" && firstVisit}
          >
            {t("confirmLocation")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
