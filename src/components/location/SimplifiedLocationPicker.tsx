
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Search, Loader2, MapPinOff } from "lucide-react";
import { useLocation } from "@/providers/LocationProvider";
import { fetchAllCities, handleCitySelection, findNearestCity } from "@/utils/cityAvailabilityUtils";
import type { City } from "@/utils/cityAvailabilityUtils";

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
  const { toast } = useToast();
  const { currentLocation, setCurrentLocation } = useLocation();
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [citiesByDistrict, setCitiesByDistrict] = useState<Record<string, City[]>>({});

  // Load cities on component mount
  useEffect(() => {
    const loadCities = async () => {
      setIsLoading(true);
      try {
        const allCities = await fetchAllCities();
        setCities(allCities);
        
        // Group cities by district
        const groupedCities = allCities.reduce((acc: Record<string, City[]>, city) => {
          if (!acc[city.district]) {
            acc[city.district] = [];
          }
          acc[city.district].push(city);
          return acc;
        }, {});
        
        setCitiesByDistrict(groupedCities);
        setFilteredCities(allCities);
      } catch (error) {
        console.error("Error loading cities:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load cities. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (open) {
      loadCities();
    }
  }, [open, toast]);

  // Filter cities based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCities(cities);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = cities.filter(city => 
      city.city_name.toLowerCase().includes(query) ||
      city.district.toLowerCase().includes(query)
    );
    
    setFilteredCities(filtered);
  }, [searchQuery, cities]);

  // Handle city selection
  const selectCity = async (city: City) => {
    try {
      const success = await handleCitySelection(city.city_name);
      if (success) {
        setCurrentLocation(city.city_name);
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error selecting city:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update location. Please try again.",
      });
    }
  };

  // Handle location detection
  const detectLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Location detection is not supported by your browser.",
      });
      return;
    }
    
    setIsDetectingLocation(true);
    
    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Find nearest city in our database
          const nearestCity = await findNearestCity(latitude, longitude);
          
          if (nearestCity) {
            // Find the city in our list
            const cityMatch = cities.find(
              c => c.city_name.toLowerCase() === nearestCity.toLowerCase()
            );
            
            if (cityMatch) {
              selectCity(cityMatch);
            } else {
              toast({
                variant: "destructive",
                title: "City Not Found",
                description: `We couldn't find ${nearestCity} in our database.`,
              });
            }
          } else {
            toast({
              variant: "destructive",
              title: "Location Not Found",
              description: "We couldn't determine your city. Please select manually.",
            });
          }
          
          setIsDetectingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          let errorMessage = "Failed to get your location. ";
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Location permission was denied.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "Request timed out.";
              break;
            default:
              errorMessage += "An unknown error occurred.";
          }
          
          toast({
            variant: "destructive",
            title: "Location Error",
            description: errorMessage,
          });
          
          setIsDetectingLocation(false);
        }
      );
    } catch (error) {
      console.error("Error in location detection:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while detecting your location.",
      });
      
      setIsDetectingLocation(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Choose your location</DialogTitle>
          <DialogDescription className="text-center">
            Zructures is currently available in select cities in the Rayalaseema region
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 flex-grow overflow-hidden flex flex-col">
          {/* Location Detection Button */}
          <Button 
            className="w-full flex items-center justify-center gap-2"
            onClick={detectLocation}
            disabled={isDetectingLocation}
          >
            {isDetectingLocation ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> 
                Detecting your location...
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4" /> 
                Detect My Current Location
              </>
            )}
          </Button>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for city or district..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* City List */}
          {isLoading ? (
            <div className="py-8 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <ScrollArea className="flex-grow pr-4">
              {Object.keys(citiesByDistrict).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(citiesByDistrict).map(([district, districtCities]) => {
                    // Filter district cities based on search query
                    const visibleCities = searchQuery.trim() === "" 
                      ? districtCities 
                      : districtCities.filter(city => 
                          city.city_name.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                        
                    if (visibleCities.length === 0) return null;
                    
                    return (
                      <div key={district} className="space-y-2">
                        <h3 className="font-semibold text-sm text-muted-foreground">{district} District</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {visibleCities.map((city) => (
                            <Button
                              key={city.id}
                              variant="outline"
                              className={`justify-start h-auto py-3 ${
                                currentLocation === city.city_name ? "border-primary" : ""
                              }`}
                              onClick={() => selectCity(city)}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="font-medium">{city.city_name}</span>
                                {city.is_available ? (
                                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                                    Available
                                  </span>
                                ) : (
                                  <span className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-1 rounded flex items-center gap-1">
                                    <MapPinOff className="h-3 w-3" /> Coming soon
                                  </span>
                                )}
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  {searchQuery.trim() !== "" 
                    ? "No cities match your search" 
                    : "No cities available"}
                </div>
              )}
            </ScrollArea>
          )}
        </div>
        
        {firstVisit && (
          <div className="mt-4 text-sm text-center text-muted-foreground">
            You can change your location anytime from the settings
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
