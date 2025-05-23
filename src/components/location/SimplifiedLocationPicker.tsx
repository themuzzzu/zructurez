
import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, Search, X } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { isZructuresAvailable, handleLocationUpdate } from "@/utils/locationUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import popularLocations from "@/data/popularLocations";

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
  
  // Use the locations from our data file
  const [filteredLocations, setFilteredLocations] = useState(popularLocations);

  useEffect(() => {
    if (address) {
      const locationName = address.split(",")[0];
      setSelectedLocation(locationName);
    }
  }, [address]);
  
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLocations(popularLocations);
    } else {
      const filtered = popularLocations.filter(location => 
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
      <DialogContent className="fixed inset-0 sm:inset-auto sm:fixed sm:top-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 bg-black border-zinc-800 overflow-hidden sm:rounded-xl shadow-lg w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-[95%] sm:max-w-[500px] p-0 z-[9999]">
        <div className="sticky top-0 z-20 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80 border-b border-zinc-800">
          <DialogHeader className="p-4 sm:p-6 pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl font-semibold text-white">
              <MapPin className="h-6 w-6 text-blue-500" />
              Choose your location
            </DialogTitle>
            <p className="text-blue-400 text-sm">
              Enable precise location or select from the list below
            </p>
          </DialogHeader>

          <div className="px-4 sm:px-6 pb-4 space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 h-12 bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-700"
              onClick={handleDetectLocation}
              disabled={loading}
            >
              <Navigation className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              {loading || isDetecting ? 'Detecting your location...' : 'Detect My Location'}
            </Button>

            {address && (
              <div className="bg-[#1a2942] rounded-lg p-4 text-blue-400 space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Precise location detected</span>
                </div>
                <div className="text-lg text-white font-medium">{selectedLocation}</div>
                <div className="text-sm opacity-80">
                  Accuracy: ±{position?.accuracy?.toFixed(0)}m
                </div>
              </div>
            )}
            
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search city or town"
                className="pl-9 h-12 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-black px-4 sm:px-6 pt-4">
          <h3 className="text-white text-lg font-medium mb-2">
            Or select a city or town
          </h3>
        </div>

        <ScrollArea className="flex-1 px-4 sm:px-6 pt-2 h-[calc(100vh-320px)] sm:h-[400px] bg-black">
          <div className="space-y-1">
            {filteredLocations.map((location) => {
              const isLocationAvailable = isZructuresAvailable(location);
              const isSelected = location === selectedLocation;
              
              return (
                <div key={location} className="space-y-1">
                  <Button 
                    variant={isSelected ? "secondary" : "ghost"}
                    className={`w-full justify-start text-left h-auto py-3 ${
                      isSelected ? 'bg-zinc-800' : 'hover:bg-zinc-900'
                    } text-white`}
                    onClick={() => handleLocationSelect(location)}
                  >
                    <MapPin className={`h-4 w-4 mr-2 shrink-0 ${
                      isSelected ? 'text-blue-500' : 'text-zinc-400'
                    }`} />
                    <div className="flex items-center justify-between w-full">
                      <span className="truncate">{location}</span>
                      {isLocationAvailable && (
                        <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">
                          Available
                        </span>
                      )}
                    </div>
                  </Button>
                  
                  {isSelected && !isLocationAvailable && (
                    <div className="rounded-md p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 ml-6">
                      <div className="flex gap-2 items-start">
                        <span className="text-yellow-500 mt-0.5">⚠</span>
                        <div>
                          <p className="font-medium">Service not available in {location}</p>
                          <p className="text-sm text-yellow-500/80">We're expanding rapidly and will be here soon!</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="sticky bottom-0 border-t border-zinc-800 bg-black">
          <DialogFooter className="p-4 sm:p-6">
            <Button 
              variant="default" 
              onClick={handleConfirmLocation} 
              className="w-full sm:w-auto h-12 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={selectedLocation === "All India" && firstVisit}
            >
              Confirm Location
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
