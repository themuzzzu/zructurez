
import { useState, useEffect, useMemo } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  MapPin, 
  Map as MapIcon, 
  Navigation, 
  Locate,
  LocateFixed,
  MapPinOff,
  Search,
  ChevronDown,
  Compass
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

// Define the structure for a nearby location
interface NearbyLocation {
  name: string;
  distance?: number; // in km
  isCurrent?: boolean;
  type: 'city' | 'area' | 'locality' | 'custom';
}

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
  const [selectedMetro, setSelectedMetro] = useState<string>(
    value.includes(" - ") ? value.split(" - ")[0] : value || "All India"
  );
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { requestGeolocation, loading, error, address, permissionStatus, position } = useGeolocation();
  
  // Nearby locations
  const [nearbyLocations, setNearbyLocations] = useState<NearbyLocation[]>([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  
  // Predefined metros and regions
  const metros = useMemo(() => [
    "All India",
    "Delhi NCR",
    "Mumbai",
    "Bengaluru",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur"
  ], []);

  const regions = useMemo<Record<string, string[]>>(() => ({
    "Delhi NCR": ["Delhi", "Gurugram", "Noida", "Faridabad", "Ghaziabad"],
    "Mumbai": ["Mumbai", "Navi Mumbai", "Thane", "Kalyan"],
    "Bengaluru": ["Central", "East", "North", "South", "West"],
    "Hyderabad": ["Secunderabad", "Cyberabad", "Hitech City", "Old City"],
    "Chennai": ["Central", "North", "South", "West", "Anna Nagar"],
    "Kolkata": ["North", "South", "Central", "Salt Lake", "Howrah"],
    "Pune": ["Central", "East", "West", "Pimpri-Chinchwad"],
    "Ahmedabad": ["East", "West", "North", "South", "Gandhinagar"],
    "Jaipur": ["Walled City", "Civil Lines", "Mansarovar", "Vaishali Nagar"]
  }), []);

  // Example nearby cities based on user's position
  // In a real implementation, this would be a call to an API or database
  const fetchNearbyLocations = async () => {
    if (!position) return;
    
    setLoadingNearby(true);
    
    try {
      // This would be a real API call in production
      // Mock data for demo purposes
      const mockNearbyData = generateMockNearbyLocations(position.latitude, position.longitude);
      
      // Add current location if we have it from reverse geocoding
      if (address) {
        const currentLocation = {
          name: extractLocalityFromAddress(address) || "Current Location",
          isCurrent: true,
          distance: 0,
          type: 'locality' as const
        };
        mockNearbyData.unshift(currentLocation);
      }
      
      setNearbyLocations(mockNearbyData);
    } catch (error) {
      console.error("Failed to fetch nearby locations:", error);
    } finally {
      setLoadingNearby(false);
    }
  };

  // Extract locality name from address 
  const extractLocalityFromAddress = (fullAddress: string): string | null => {
    // Simple approach - a real implementation would be more sophisticated
    if (!fullAddress) return null;
    
    // Try to extract a meaningful locality name
    const parts = fullAddress.split(',').map(part => part.trim());
    
    // Usually the first or second part will be the locality
    if (parts.length > 1) {
      // Return the first part that isn't just a number or too short
      return parts.find(p => p.length > 3 && !/^\d+$/.test(p)) || parts[0];
    }
    
    return parts[0] || null;
  };

  // Initialize with recently used locations from localStorage if available
  const [recentLocations, setRecentLocations] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentLocations');
    return saved ? JSON.parse(saved) : [];
  });

  // Update recently used locations when a location is selected
  useEffect(() => {
    if (value && value !== "All India" && !recentLocations.includes(value)) {
      const updated = [value, ...recentLocations.slice(0, 4)];
      setRecentLocations(updated);
      localStorage.setItem('recentLocations', JSON.stringify(updated));
    }
  }, [value]);
  
  // Fetch nearby locations when position changes
  useEffect(() => {
    if (position) {
      fetchNearbyLocations();
    }
  }, [position]);

  const handleMetroChange = (metro: string) => {
    setSelectedMetro(metro);
    if (metro === "All India") {
      onChange("All India");
    } else {
      onChange(`${metro} - All Areas`);
    }
  };

  const handleRegionChange = (region: string) => {
    onChange(`${selectedMetro} - ${region}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Simple search across metros and regions
    const results: string[] = [];
    
    // Search in metros
    metros.forEach(metro => {
      if (metro.toLowerCase().includes(query.toLowerCase())) {
        results.push(metro);
      }
      
      // Search in regions of this metro
      if (regions[metro]) {
        regions[metro].forEach(region => {
          if (region.toLowerCase().includes(query.toLowerCase())) {
            results.push(`${metro} - ${region}`);
          }
        });
      }
    });
    
    // Also search in nearby locations
    nearbyLocations.forEach(loc => {
      if (loc.name.toLowerCase().includes(query.toLowerCase())) {
        results.push(loc.name);
      }
    });
    
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleDetectLocation = () => {
    requestGeolocation();
  };

  const selectNearbyLocation = (location: NearbyLocation) => {
    onChange(location.name);
    setPopoverOpen(false);
  };

  // Helper to generate mock nearby locations based on coordinates
  const generateMockNearbyLocations = (lat: number, lon: number): NearbyLocation[] => {
    // This would be a real API call in production
    // For demo, generate some random nearby locations based on the general region
    
    // Sample cities in India - in a real app, this would be based on actual proximity
    let nearbyPlaces: NearbyLocation[] = [];
    
    // Based on general region in India (very rough approximation)
    if (lat > 28) { // North India
      nearbyPlaces = [
        { name: "New Delhi", distance: 5, type: 'city' },
        { name: "Gurgaon", distance: 15, type: 'city' },
        { name: "Noida", distance: 20, type: 'city' },
        { name: "Rohini", distance: 8, type: 'area' },
        { name: "Pitampura", distance: 12, type: 'locality' }
      ];
    } else if (lat > 19) { // Central India
      nearbyPlaces = [
        { name: "Mumbai", distance: 8, type: 'city' },
        { name: "Pune", distance: 120, type: 'city' },
        { name: "Thane", distance: 25, type: 'city' },
        { name: "Bandra", distance: 10, type: 'area' },
        { name: "Andheri", distance: 15, type: 'locality' }
      ];
    } else if (lat > 12) { // South India
      nearbyPlaces = [
        { name: "Bangalore", distance: 7, type: 'city' },
        { name: "Hyderabad", distance: 140, type: 'city' },
        { name: "Chennai", distance: 290, type: 'city' },
        { name: "Koramangala", distance: 5, type: 'area' },
        { name: "Indiranagar", distance: 10, type: 'locality' }
      ];
    } else { // Default/fallback
      nearbyPlaces = [
        { name: "Hyderabad", distance: 8, type: 'city' },
        { name: "Secunderabad", distance: 15, type: 'city' },
        { name: "Jubilee Hills", distance: 5, type: 'area' },
        { name: "Gachibowli", distance: 12, type: 'locality' },
        { name: "HITEC City", distance: 10, type: 'locality' }
      ];
    }
    
    return nearbyPlaces;
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
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search location..." />
              <CommandList>
                <CommandEmpty>No locations found</CommandEmpty>
                
                {position && nearbyLocations.length > 0 && (
                  <CommandGroup heading="Nearby Locations">
                    {nearbyLocations.map((location, index) => (
                      <CommandItem
                        key={`nearby-${index}`}
                        onSelect={() => selectNearbyLocation(location)}
                      >
                        {location.isCurrent ? (
                          <LocateFixed className="mr-2 h-4 w-4 text-primary" />
                        ) : (
                          <MapPin className="mr-2 h-4 w-4" />
                        )}
                        <span>{location.name}</span>
                        {location.distance !== undefined && location.distance > 0 && (
                          <Badge 
                            variant="outline" 
                            className="ml-auto text-xs font-normal"
                          >
                            {location.distance}km
                          </Badge>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                
                {!position && (
                  <div className="p-2">
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={handleDetectLocation}
                      disabled={loading}
                    >
                      {loading ? (
                        <Locate className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Compass className="mr-2 h-4 w-4" />
                      )}
                      Detect my location
                    </Button>
                  </div>
                )}
                
                <CommandGroup heading="Popular Cities">
                  {metros.slice(1).map((metro) => (
                    <CommandItem
                      key={metro}
                      onSelect={() => handleMetroChange(metro)}
                    >
                      <MapIcon className="mr-2 h-4 w-4" />
                      {metro}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-2 space-y-2">
        {showDetect && (
          <Button
            variant="outline"
            size="sm"
            className={`w-full flex items-center justify-center gap-2 ${
              loading ? "animate-pulse" : ""
            }`}
            onClick={handleDetectLocation}
            disabled={loading || permissionStatus === "denied"}
          >
            {loading ? (
              <>
                <Locate className="h-4 w-4 animate-spin" />
                Detecting your location...
              </>
            ) : permissionStatus === "denied" ? (
              <>
                <MapPinOff className="h-4 w-4" />
                Location access denied
              </>
            ) : (
              <>
                <LocateFixed className="h-4 w-4" />
                {permissionStatus === "granted" ? "Update my location" : "Detect my location"}
              </>
            )}
          </Button>
        )}

        <div className="flex items-center">
          <Input
            className="flex-1"
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {searchQuery.length > 0 && (
          <Card className="p-2 max-h-60 overflow-y-auto">
            {isSearching ? (
              <div className="text-center text-sm text-muted-foreground py-2">Searching...</div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-1">
                {searchResults.map((result, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      onChange(result);
                      setSearchQuery("");
                    }}
                  >
                    <MapPin className="h-3 w-3 mr-2" />
                    {result}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-2">No results found</div>
            )}
          </Card>
        )}
      </div>

      {position && nearbyLocations.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-1.5">Nearby Locations</h4>
          <div className="space-y-1 max-h-44 overflow-y-auto">
            {nearbyLocations.map((location, index) => (
              <Button
                key={index}
                variant={value === location.name ? "default" : "outline"}
                size="sm"
                className="w-full justify-start text-sm"
                onClick={() => onChange(location.name)}
              >
                {location.isCurrent ? (
                  <LocateFixed className="h-3.5 w-3.5 mr-2 text-primary" />
                ) : (
                  <MapPin className="h-3.5 w-3.5 mr-2" />
                )}
                <span className="flex-1 text-left truncate">{location.name}</span>
                {location.distance !== undefined && location.distance > 0 && (
                  <Badge variant="outline" className="ml-1.5 text-xs font-normal">
                    {location.distance}km
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {recentLocations.length > 0 && searchQuery.length === 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-1.5">Recently Used</h4>
          <div className="flex flex-wrap gap-1.5">
            {recentLocations.map((loc, idx) => (
              <Button
                key={idx}
                variant={value === loc ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() => onChange(loc)}
              >
                <MapPin className="h-3 w-3 mr-1.5" />
                {loc}
              </Button>
            ))}
          </div>
        </div>
      )}

      <h4 className="text-sm font-medium mb-1.5">Select Region</h4>
      <Select value={selectedMetro} onValueChange={handleMetroChange}>
        <SelectTrigger className="mb-2">
          <SelectValue placeholder="Select metro" />
        </SelectTrigger>
        <SelectContent>
          {metros.map((metro) => (
            <SelectItem key={metro} value={metro}>
              {metro}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedMetro !== "All India" && (
        <>
          <h4 className="text-sm font-medium mb-1.5">Select Area</h4>
          <Select
            value={value.includes(" - ") ? value.split(" - ")[1] : "All Areas"}
            onValueChange={handleRegionChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Areas">All Areas</SelectItem>
              {regions[selectedMetro]?.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      )}
    </div>
  );
};
