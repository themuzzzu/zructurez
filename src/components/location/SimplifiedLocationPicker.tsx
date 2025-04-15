
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
import { MapPin, Locate, Search, X, AlertCircle } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { isZructuresAvailable, handleLocationUpdate, reverseGeocode } from "@/utils/locationUtils";
import { toast } from "sonner";

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
  const { 
    requestGeolocation, 
    loading, 
    position, 
    error,
    permissionStatus 
  } = useGeolocation();
  
  const [detectedAddress, setDetectedAddress] = useState<string | null>(null);
  const [isProcessingLocation, setIsProcessingLocation] = useState(false);
  
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

  // Process the detected location from coordinates
  useEffect(() => {
    async function processLocation() {
      if (position && !detectedAddress) {
        setIsProcessingLocation(true);
        try {
          const { city, state, displayName } = await reverseGeocode(
            position.latitude, 
            position.longitude
          );
          
          // If we have a city, use it
          if (city) {
            const locationString = `${city}${state ? `, ${state}` : ''}`;
            setDetectedAddress(locationString);
            setSelectedLocation(locationString);
            handleLocationUpdate(locationString);
          } else {
            // If no city found, use the display name
            setDetectedAddress(displayName);
            setSelectedLocation(displayName);
            handleLocationUpdate(displayName);
          }
          
          // Show precise location toast
          toast.success(`Precise location detected: ${displayName}`);
        } catch (error) {
          console.error("Error processing location:", error);
          toast.error("Could not determine your precise location");
        } finally {
          setIsProcessingLocation(false);
        }
      }
    }
    
    processLocation();
  }, [position, detectedAddress]);

  const handleDetectLocation = async () => {
    // Reset detected address when requesting a new location
    setDetectedAddress(null);
    await requestGeolocation();
    
    if (permissionStatus === "denied") {
      toast.error("Location permission denied. Please enable location in your browser settings.");
    }
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
            disabled={loading || isProcessingLocation}
            size="lg"
          >
            <Locate className={`h-5 w-5 ${(loading || isProcessingLocation) ? "animate-spin" : ""}`} />
            {loading || isProcessingLocation ? "Detecting Your Location..." : "Detect My Location"}
          </Button>
          
          {/* Show detected precise address if available */}
          {detectedAddress && (
            <div className="rounded-md p-3 bg-blue-900/30 border border-blue-800/40 text-blue-300">
              <div className="flex gap-2 items-start">
                <MapPin className="h-4 w-4 mt-0.5 text-blue-300" />
                <div>
                  <p className="font-medium">Precise location detected</p>
                  <p className="text-sm text-blue-300/80">{detectedAddress}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Error message if location detection failed */}
          {error && !loading && (
            <div className="rounded-md p-3 bg-red-900/30 border border-red-800/40 text-red-300">
              <div className="flex gap-2 items-start">
                <AlertCircle className="h-4 w-4 mt-0.5 text-red-300" />
                <div>
                  <p className="font-medium">Location detection failed</p>
                  <p className="text-sm text-red-300/80">{error}</p>
                </div>
              </div>
            </div>
          )}
          
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
                    
                    {/* Availability indicators */}
                    {selectedLocation === location && (
                      <div className={`rounded-md p-3 ${isAvailable 
                        ? "bg-green-900/30 border border-green-800/40 text-green-300" 
                        : "bg-amber-900/30 border border-amber-800/40 text-amber-300"
                      } ml-6`}>
                        <div className="flex gap-2 items-start">
                          <span className={isAvailable ? "text-green-300 mt-0.5" : "text-amber-300 mt-0.5"}>
                            {isAvailable ? "✓" : "⚠"}
                          </span>
                          <div>
                            <p className="font-medium">
                              {isAvailable 
                                ? `Zructures is available in ${location}` 
                                : `Zructures is not yet available in ${location}`
                              }
                            </p>
                            <p className="text-sm text-amber-400/80">
                              {isAvailable 
                                ? "You can access all features and services." 
                                : "We're expanding rapidly! You'll still be able to browse but some features might be limited."
                              }
                            </p>
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
        
        {/* Add footer with confirm button for better UX, especially on first visit */}
        {firstVisit && (
          <DialogFooter className="mt-6">
            <Button 
              onClick={() => onOpenChange(false)}
              className="w-full"
              variant="default"
              disabled={selectedLocation === "All India"}
            >
              Confirm Location
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

