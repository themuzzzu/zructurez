
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Locate, Search, ChevronDown } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { isZructuresAvailable } from "@/utils/locationUtils";

export interface LocationSelectorProps {
  value: string;
  onChange: (location: string) => void;
  className?: string;
  showDetect?: boolean;
  compact?: boolean;
}

export const EnhancedLocationSelector = ({ 
  value, 
  onChange,
  className = "",
  showDetect = true,
  compact = false
}: LocationSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { requestGeolocation, loading } = useGeolocation();
  const isLocationAvailable = isZructuresAvailable(value);
  
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

  const handleDetectLocation = () => {
    requestGeolocation();
  };

  const selectLocation = (location: string) => {
    onChange(location);
    setPopoverOpen(false);
    setSearchQuery("");
  };

  if (compact) {
    return (
      <div className={`flex items-center ${className}`}>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 px-2"
              disabled={loading}
            >
              {loading ? <Locate className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
              <span className="max-w-32 truncate">{value || "Select location"}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2 bg-zinc-900 text-white border-zinc-800">
            <div className="space-y-2">
              {showDetect && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white"
                  onClick={handleDetectLocation}
                  disabled={loading}
                >
                  <Locate className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                  {loading ? "Detecting..." : "Detect My Location"}
                </Button>
              )}
              
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                <Input
                  placeholder="Search city or town"
                  className="pl-7 py-1 h-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="max-h-48 overflow-y-auto">
                {filteredLocations.map((location) => (
                  <Button 
                    key={location}
                    variant="ghost" 
                    size="sm"
                    className="w-full justify-start text-left text-white hover:bg-zinc-800"
                    onClick={() => selectLocation(location)}
                  >
                    <MapPin className="h-3.5 w-3.5 mr-2 text-zinc-400" />
                    <span>{location}</span>
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {value && value !== "All India" && (
          <Badge 
            variant={isLocationAvailable ? "success" : "warning"} 
            className="h-2 w-2 rounded-full p-0"
          />
        )}
      </div>
    );
  }

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-between ${className}`}
          disabled={loading}
        >
          <div className="flex items-center gap-2">
            {loading ? <Locate className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
            <span className="truncate">{value || "Select location"}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 bg-zinc-900 text-white border-zinc-800" align="start">
        <div className="p-2 space-y-2">
          {showDetect && (
            <Button 
              variant="outline" 
              className="w-full justify-start bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white"
              onClick={handleDetectLocation}
              disabled={loading}
            >
              <Locate className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
              {loading ? "Detecting..." : "Detect My Location"}
            </Button>
          )}
          
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search city or town"
              className="pl-8 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="pt-2">
            <h3 className="px-2 text-sm font-medium text-zinc-400">Select Location</h3>
            <div className="mt-1 max-h-52 overflow-y-auto">
              {filteredLocations.map((location) => (
                <Button 
                  key={location}
                  variant="ghost" 
                  className="w-full justify-start text-left text-white hover:bg-zinc-800"
                  onClick={() => selectLocation(location)}
                >
                  <MapPin className="h-4 w-4 mr-2 text-zinc-400" />
                  <span>{location}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
