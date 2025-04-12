
import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Compass, Locate, Search, X, AlertTriangle, CheckCircle } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Badge } from "@/components/ui/badge";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { 
  fetchAllCities, 
  DEFAULT_CITY,
  handleCitySelection,
  findNearestCity,
  City
} from "@/utils/cityAvailabilityUtils";

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
    localStorage.getItem("userLocation") || DEFAULT_CITY
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const { requestGeolocation, loading: geoLoading, position } = useGeolocation();
  
  // Fetch city data when component mounts
  useEffect(() => {
    const loadCities = async () => {
      setLoading(true);
      const cityData = await fetchAllCities();
      setCities(cityData);
      setFilteredCities(cityData);
      setLoading(false);
    };
    
    loadCities();
  }, []);
  
  // Filter cities based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCities(cities);
      return;
    }
    
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = cities.filter(city => 
      city.city_name.toLowerCase().includes(lowerQuery) ||
      city.district.toLowerCase().includes(lowerQuery)
    );
    
    setFilteredCities(filtered);
  }, [searchQuery, cities]);
  
  // Handle position change to find nearest city
  useEffect(() => {
    if (position) {
      const findCity = async () => {
        const nearestCity = await findNearestCity(
          position.latitude, 
          position.longitude
        );
        
        if (nearestCity) {
          setSelectedLocation(nearestCity);
        }
      };
      
      findCity();
    }
  }, [position]);

  const handleDetectLocation = async () => {
    requestGeolocation();
  };

  const handleCitySelect = (cityName: string) => {
    setSelectedLocation(cityName);
  };

  const handleConfirmLocation = async () => {
    const success = await handleCitySelection(selectedLocation);
    
    if (success) {
      onOpenChange(false);
      if (firstVisit) {
        localStorage.setItem('locationPromptShown', 'true');
      }
    }
  };

  // Group cities by district
  const citiesByDistrict = filteredCities.reduce((acc: Record<string, City[]>, city) => {
    if (!acc[city.district]) {
      acc[city.district] = [];
    }
    acc[city.district].push(city);
    return acc;
  }, {});

  return (
    <Dialog open={open} onOpenChange={firstVisit ? () => {} : onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Choose your location
          </DialogTitle>
          <DialogDescription>
            Select a city from Rayalaseema region to get started
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={handleDetectLocation}
              disabled={geoLoading}
            >
              {geoLoading ? (
                <Locate className="h-4 w-4 animate-spin" />
              ) : (
                <Compass className="h-4 w-4" />
              )}
              {geoLoading 
                ? "Detecting your location..." 
                : "Detect my current location"}
            </Button>
            
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for a city..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="rounded-md border h-[300px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Locate className="h-5 w-5 animate-spin" />
                  <span className="ml-2">Loading cities...</span>
                </div>
              ) : (
                <Command>
                  <CommandList>
                    <CommandEmpty>No cities found</CommandEmpty>
                    
                    {Object.entries(citiesByDistrict).map(([district, districtCities]) => (
                      <CommandGroup heading={district} key={district}>
                        {districtCities.map((city) => (
                          <CommandItem
                            key={city.id}
                            onSelect={() => handleCitySelect(city.city_name)}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <MapPin className="mr-2 h-4 w-4" />
                              <span>{city.city_name}</span>
                            </div>
                            {city.is_available ? (
                              <Badge variant="success" className="text-xs">Available</Badge>
                            ) : (
                              <Badge variant="warning" className="text-xs">Coming soon</Badge>
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
                  </CommandList>
                </Command>
              )}
            </div>
            
            {selectedLocation && (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Selected Location:</span>
                  <span className="font-semibold">{selectedLocation}</span>
                </div>
                
                <div className="mt-2">
                  {cities.find(c => c.city_name === selectedLocation)?.is_available ? (
                    <div className="flex p-3 rounded-md border border-green-100 bg-green-50 dark:bg-green-900/20 dark:border-green-900/30">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                      <p className="text-sm text-green-700 dark:text-green-400">
                        Zructures is available in {selectedLocation}!
                      </p>
                    </div>
                  ) : (
                    <div className="flex p-3 rounded-md border border-amber-100 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-900/30">
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-amber-700 dark:text-amber-400">
                          Zructures is not yet available in {selectedLocation}.
                        </p>
                        <p className="text-xs text-amber-600 dark:text-amber-300 mt-1">
                          We're expanding fast. You can browse, but some features will be limited.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="default" 
            onClick={handleConfirmLocation} 
            className="w-full sm:w-auto"
          >
            Confirm Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
