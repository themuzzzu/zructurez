
import { useState, useEffect, useRef } from "react";
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
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

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
  const { requestGeolocation, loading, error, address, permissionStatus } = useGeolocation();
  
  const metros = [
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
  ];

  const regions: Record<string, string[]> = {
    "Delhi NCR": ["Delhi", "Gurugram", "Noida", "Faridabad", "Ghaziabad"],
    "Mumbai": ["Mumbai", "Navi Mumbai", "Thane", "Kalyan"],
    "Bengaluru": ["Central", "East", "North", "South", "West"],
    "Hyderabad": ["Secunderabad", "Cyberabad", "Hitech City", "Old City"],
    "Chennai": ["Central", "North", "South", "West", "Anna Nagar"],
    "Kolkata": ["North", "South", "Central", "Salt Lake", "Howrah"],
    "Pune": ["Central", "East", "West", "Pimpri-Chinchwad"],
    "Ahmedabad": ["East", "West", "North", "South", "Gandhinagar"],
    "Jaipur": ["Walled City", "Civil Lines", "Mansarovar", "Vaishali Nagar"]
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
    
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleDetectLocation = () => {
    requestGeolocation();
  };

  if (compact) {
    return (
      <div className={`flex items-center ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1.5 px-2"
          onClick={handleDetectLocation}
          disabled={loading}
        >
          {loading ? <Locate className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
          <span className="max-w-32 truncate">{value || "Select location"}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
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

      {recentLocations.length > 0 && searchQuery.length === 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-1.5">Recently Used</h4>
          <div className="flex flex-wrap gap-1.5">
            {recentLocations.map((loc, idx) => (
              <Button
                key={idx}
                variant="outline"
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
