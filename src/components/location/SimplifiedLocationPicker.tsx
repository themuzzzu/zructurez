
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
import { MapPin, Locate, Search, X } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { isZructuresAvailable, handleLocationUpdate } from "@/utils/locationUtils";

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
  const { requestGeolocation, loading } = useGeolocation();
  
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

  const handleDetectLocation = async () => {
    requestGeolocation();
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    handleLocationUpdate(location);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={firstVisit ? () => {} : onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6 bg-zinc-900 text-white border-zinc-800">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2 text-2xl font-semibold text-white">
            <MapPin className="h-7 w-7" />
            Choose your location
          </DialogTitle>
          {!firstVisit && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-4 top-4 text-zinc-400 hover:text-white hover:bg-zinc-800"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
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
            {loading ? "Detecting Your Location..." : "Detect My Location"}
          </Button>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search city or town"
              className="pl-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Location List */}
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Or select a city or town</h3>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {filteredLocations.map((location) => {
                const isAvailable = isZructuresAvailable(location);
                
                return (
                  <div key={location} className="space-y-1">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left text-white hover:bg-zinc-800"
                      onClick={() => handleLocationSelect(location)}
                    >
                      <MapPin className="h-4 w-4 mr-2 text-zinc-400" />
                      <span>{location}</span>
                    </Button>
                    
                    {/* Only show availability message for the currently selected location */}
                    {selectedLocation === location && !isAvailable && (
                      <div className="rounded-md p-3 bg-amber-900/30 border border-amber-800/40 text-amber-300 ml-6">
                        <div className="flex gap-2 items-start">
                          <span className="text-amber-300 mt-0.5">⚠</span>
                          <div>
                            <p className="font-medium">Zructures is not yet available in {location}.</p>
                            <p className="text-sm text-amber-400/80">We're expanding rapidly! You'll still be able to browse but some features might be limited.</p>
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
      </DialogContent>
    </Dialog>
  );
}
