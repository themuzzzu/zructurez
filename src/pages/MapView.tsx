
import { useState, useEffect, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, CornerRightDown, LocateFixed, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { NearMeFilter } from '@/components/location/NearMeFilter';
import { useGeolocation } from "@/hooks/useGeolocation";

interface Location {
  id: string;
  name: string;
  type: 'business' | 'service' | 'event';
  category: string;
  latitude: number;
  longitude: number;
  distance?: number;
}

const MapView = () => {
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [nearbyLocations, setNearbyLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [visibleRadius, setVisibleRadius] = useState(5);
  const { position, requestGeolocation } = useGeolocation();
  
  // Mock data - in a real app this would come from an API
  useEffect(() => {
    if (!position) return;
    
    // Generate mock nearby locations based on user's position
    const mockLocations: Location[] = [
      {
        id: 'b1',
        name: 'ABC Restaurant',
        type: 'business',
        category: 'Food',
        latitude: position.latitude + 0.001,
        longitude: position.longitude + 0.002,
        distance: 0.3
      },
      {
        id: 'b2',
        name: 'XYZ Electronics',
        type: 'business',
        category: 'Electronics',
        latitude: position.latitude - 0.002,
        longitude: position.longitude + 0.001,
        distance: 0.5
      },
      {
        id: 's1',
        name: 'Home Cleaning Services',
        type: 'service',
        category: 'Home Services',
        latitude: position.latitude + 0.003,
        longitude: position.longitude - 0.002,
        distance: 0.7
      },
      {
        id: 's2',
        name: 'Plumbing Solutions',
        type: 'service',
        category: 'Repair',
        latitude: position.latitude - 0.001,
        longitude: position.longitude - 0.003,
        distance: 0.9
      },
      {
        id: 'e1',
        name: 'Local Food Festival',
        type: 'event',
        category: 'Food',
        latitude: position.latitude + 0.004,
        longitude: position.longitude + 0.003,
        distance: 1.2
      },
    ];
    
    setNearbyLocations(mockLocations);
    setFilteredLocations(mockLocations);
  }, [position]);

  useEffect(() => {
    // Filter locations based on search and radius
    if (nearbyLocations.length === 0) return;
    
    const filtered = nearbyLocations.filter(location => {
      const matchesSearch = searchQuery === '' || 
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        location.category.toLowerCase().includes(searchQuery.toLowerCase());
        
      const withinRadius = location.distance && location.distance <= visibleRadius;
      
      return matchesSearch && withinRadius;
    });
    
    setFilteredLocations(filtered);
  }, [searchQuery, nearbyLocations, visibleRadius]);
  
  useEffect(() => {
    if (!position) {
      requestGeolocation();
    }
  }, []);
  
  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleNearMeFilterChange = (filter: {enabled: boolean, radius: number}) => {
    if (filter.enabled) {
      setVisibleRadius(filter.radius);
    }
  };
  
  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
  };

  return (
    <Layout>
      <div className="container max-w-7xl py-4">
        <div className="flex flex-col-reverse lg:flex-row gap-4 h-[calc(100vh-11rem)]">
          {/* Left sidebar - location listings */}
          <Card className="w-full lg:w-1/3 overflow-hidden flex flex-col">
            <div className="p-3 border-b">
              <div className="flex items-center gap-2 mb-3">
                <Input
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Nearby Locations</h3>
                <NearMeFilter 
                  onFilterChange={handleNearMeFilterChange}
                  compact 
                  defaultRadius={5}
                />
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1">
              {filteredLocations.length > 0 ? (
                <div className="divide-y">
                  {filteredLocations.map((location) => (
                    <div 
                      key={location.id}
                      className={`p-3 hover:bg-muted/50 cursor-pointer ${
                        selectedLocation?.id === location.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => handleLocationClick(location)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`
                          h-10 w-10 rounded-full flex items-center justify-center
                          ${location.type === 'business' ? 'bg-blue-100' : 
                            location.type === 'service' ? 'bg-green-100' : 'bg-amber-100'}
                        `}>
                          <MapPin className={`h-5 w-5 
                            ${location.type === 'business' ? 'text-blue-600' : 
                              location.type === 'service' ? 'text-green-600' : 'text-amber-600'}
                          `} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{location.name}</h4>
                          <p className="text-xs text-muted-foreground">{location.category}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge 
                              variant="outline" 
                              className={`text-xs px-1.5 ${
                                location.type === 'business' ? 'border-blue-200' : 
                                location.type === 'service' ? 'border-green-200' : 'border-amber-200'
                              }`}
                            >
                              {location.type}
                            </Badge>
                            {location.distance !== undefined && (
                              <Badge variant="secondary" className="text-xs px-1.5">
                                {location.distance} km
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">No locations found</p>
                  {searchQuery && (
                    <Button 
                      variant="link" 
                      size="sm"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
          
          {/* Right side - Map */}
          <div className="flex-1 bg-muted rounded-lg overflow-hidden relative">
            {!mapLoaded ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="space-y-2 w-full max-w-md px-8">
                  <Skeleton className="h-6 w-1/3 mx-auto" />
                  <Skeleton className="h-64 w-full rounded-lg" />
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full bg-[#f0f0f0] relative">
                {!position && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="text-center p-6 rounded-lg">
                      <LocateFixed className="h-10 w-10 mx-auto mb-4 text-primary" />
                      <h3 className="text-lg font-medium mb-2">Enable location access</h3>
                      <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                        We need your location to show nearby places and services on the map
                      </p>
                      <Button onClick={requestGeolocation}>
                        Enable Location
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Map placeholder - in a real app, this would be replaced by an actual map library */}
                <div className="h-full bg-[#e8eaed] flex items-center justify-center">
                  <div className="text-center p-6">
                    <CornerRightDown className="h-8 w-8 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      Map placeholder - In a real app, this would be a map showing the locations.
                    </p>
                  </div>
                </div>
                
                {/* Location details panel when a location is selected */}
                {selectedLocation && (
                  <div className="absolute top-4 right-4 bg-background shadow-lg rounded-lg w-72 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{selectedLocation.name}</h3>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => setSelectedLocation(null)}
                      >
                        <span className="sr-only">Close</span>
                        &times;
                      </Button>
                    </div>
                    <div className="text-sm mb-3">
                      <p className="text-muted-foreground">{selectedLocation.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          className={`${
                            selectedLocation.type === 'business' ? 'bg-blue-100 text-blue-800' : 
                            selectedLocation.type === 'service' ? 'bg-green-100 text-green-800' : 
                                                              'bg-amber-100 text-amber-800'
                          } border-none`}
                        >
                          {selectedLocation.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {selectedLocation.distance} km away
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => 
                          navigate(`/${selectedLocation.type}/${selectedLocation.id}`)
                        }
                      >
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Directions
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Map controls */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                  <Button 
                    variant="default" 
                    size="icon" 
                    className="h-10 w-10 rounded-full shadow-lg bg-background text-foreground hover:bg-background/90"
                    onClick={requestGeolocation}
                  >
                    <LocateFixed className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MapView;
