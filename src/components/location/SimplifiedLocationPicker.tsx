
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
import { MapPin, Navigation, Search, X } from "lucide-react";
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
      <DialogContent className="fixed inset-0 sm:inset-auto sm:fixed sm:top-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 bg-background border-border overflow-y-auto sm:rounded-xl shadow-lg w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-[95%] sm:max-w-[500px] p-0 z-[9999]">
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
          <DialogHeader className="p-4 sm:p-6 pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl font-semibold">
              <MapPin className="h-6 w-6 text-primary" />
              {t("chooseYourLocation")}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Select your location to find nearby services
            </DialogDescription>
          </DialogHeader>

          <div className="px-4 sm:px-6 pb-4 space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 h-12"
              onClick={handleDetectLocation}
              disabled={loading}
            >
              <Navigation className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              {loading || isDetecting ? t("detectingYourLocation") : t("detectMyLocation")}
            </Button>
            
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchCityOrTown")}
                className="pl-9 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4 sm:p-6 pt-2 h-[calc(100vh-220px)] sm:h-[400px]">
          <div className="space-y-4">
            <div className="text-sm font-medium text-muted-foreground mb-2">{t("orSelectCityOrTown")}</div>
            <div className="space-y-1">
              {filteredLocations.map((location) => {
                const isLocationAvailable = isZructuresAvailable(location);
                const isSelected = location === selectedLocation;
                
                return (
                  <div key={location} className="space-y-1">
                    <Button 
                      variant={isSelected ? "secondary" : "ghost"}
                      className={`w-full justify-start text-left h-auto py-3 ${
                        isSelected ? 'bg-secondary' : ''
                      }`}
                      onClick={() => handleLocationSelect(location)}
                    >
                      <MapPin className={`h-4 w-4 mr-2 shrink-0 ${
                        isSelected ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <span className="truncate">{location}</span>
                    </Button>
                    
                    {isSelected && !isLocationAvailable && (
                      <div className="rounded-md p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 ml-6">
                        <div className="flex gap-2 items-start">
                          <span className="text-yellow-500 mt-0.5">⚠</span>
                          <div>
                            <p className="font-medium">{t("notAvailableIn").replace("{location}", location)}</p>
                            <p className="text-sm text-yellow-500/80">{t("expandingRapidly")}</p>
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

        <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <DialogFooter className="p-4 sm:p-6">
            <Button 
              variant="default" 
              onClick={handleConfirmLocation} 
              className="w-full sm:w-auto h-12"
              disabled={selectedLocation === "All India" && firstVisit}
            >
              {t("confirmLocation")}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
