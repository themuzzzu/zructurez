
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
import { MapPin, Locate, Search, X, AlertCircle, Navigation, Map } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { isZructuresAvailable, handleLocationUpdate, reverseGeocode } from "@/utils/locationUtils";
import { toast } from "sonner";

interface SimplifiedLocationPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  firstVisit?: boolean;
}

// Custom Loader component
const Loader = ({ className = "" }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

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
    permissionStatus,
    streetName,
    cityName,
    fullAddress 
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
    if (position && (fullAddress || cityName) && !detectedAddress) {
      setIsProcessingLocation(false);
      
      // Use the most detailed address information available
      if (streetName && cityName) {
        const locationString = `${streetName}, ${cityName}`;
        setDetectedAddress(locationString);
        setSelectedLocation(locationString);
        handleLocationUpdate(locationString);
      } else if (fullAddress) {
        setDetectedAddress(fullAddress);
        setSelectedLocation(fullAddress);
        handleLocationUpdate(fullAddress);
      } else if (cityName) {
        setDetectedAddress(cityName);
        setSelectedLocation(cityName);
        handleLocationUpdate(cityName);
      }
    }
  }, [position, fullAddress, cityName, streetName, detectedAddress]);

  const handleDetectLocation = async () => {
    // Reset detected address when requesting a new location
    setDetectedAddress(null);
    setIsProcessingLocation(true);
    await requestGeolocation();
    
    if (permissionStatus === "denied") {
      toast.error("Location permission denied. Please enable location in your browser settings.");
      setIsProcessingLocation(false);
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
          <DialogDescription className="text-zinc-400">
            Enable precise location or select from the list below
          </DialogDescription>
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
            {loading || isProcessingLocation ? (
              <Loader className="h-5 w-5" />
            ) : (
              <Navigation className="h-5 w-5" />
            )}
            {loading || isProcessingLocation ? "Detecting Your Precise Location..." : "Detect My Location"}
          </Button>
          
          {/* Show detected precise address if available */}
          {detectedAddress && (
            <div className="rounded-md p-3 bg-blue-900/30 border border-blue-800/40 text-blue-300">
              <div className="flex gap-2 items-start">
                <MapPin className="h-4 w-4 mt-0.5 text-blue-300" />
                <div>
                  <p className="font-medium">Precise location detected</p>
                  <p className="text-sm text-blue-300/80">{detectedAddress}</p>
                  {position?.accuracy && (
                    <p className="text-xs text-blue-300/60 mt-1">
                      Accuracy: ±{Math.round(position.accuracy)}m
                    </p>
                  )}
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
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-xs text-red-300 p-0 h-auto mt-1"
                    onClick={() => toast.info("To enable location: In Chrome, click the padlock icon next to the URL, then set Location to Allow.")}
                  >
                    How to enable location access?
                  </Button>
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
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-white mb-2">Or select a city or town</h3>
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

        <DialogFooter className="mt-6">
          <Button 
            variant="default" 
            onClick={() => handleLocationSelect(selectedLocation)} 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            disabled={selectedLocation === "All India" && firstVisit}
          >
            Confirm Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
