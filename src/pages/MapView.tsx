
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { LocationMap } from "@/components/location/LocationMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "@/providers/LocationProvider";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  MapPin, 
  Locate, 
  ListFilter, 
  Store, 
  ShoppingBag, 
  Briefcase 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface NearbyItem {
  id: string;
  name: string;
  title?: string;
  description: string;
  image_url: string;
  latitude: number;
  longitude: number;
  type: 'business' | 'product' | 'service';
}

export default function MapView() {
  const { currentLocation, isLocationAvailable, setShowLocationPicker } = useLocation();
  const { requestGeolocation, position, loading: geoLoading } = useGeolocation();
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | undefined>(
    position ? { lat: position.latitude, lng: position.longitude } : undefined
  );
  const [activeFilter, setActiveFilter] = useState<'all' | 'business' | 'product' | 'service'>('all');
  const [selectedItem, setSelectedItem] = useState<NearbyItem | null>(null);
  
  // Update map center when position changes
  useEffect(() => {
    if (position) {
      setMapCenter({ lat: position.latitude, lng: position.longitude });
    }
  }, [position]);
  
  // Fetch nearby businesses based on location
  const { data: nearbyItems = [], isLoading: loadingNearby } = useQuery({
    queryKey: ['nearby-items', position?.latitude, position?.longitude, activeFilter],
    queryFn: async () => {
      if (!position) return [];
      
      const radius = 10; // 10km radius
      const lat = position.latitude;
      const lng = position.longitude;
      
      // Calculate bounding box for optimization (rough estimate)
      const latDelta = radius * 0.01; // ~1km = 0.01 degrees latitude
      const lngDelta = radius * 0.01 / Math.cos(lat * Math.PI / 180);
      
      const minLat = lat - latDelta;
      const maxLat = lat + latDelta;
      const minLng = lng - lngDelta;
      const maxLng = lng + lngDelta;
      
      const items: NearbyItem[] = [];
      
      try {
        // Only fetch businesses if filter is 'all' or 'business'
        if (activeFilter === 'all' || activeFilter === 'business') {
          const { data: businesses, error: businessError } = await supabase
            .from('businesses')
            .select('id, name, description, image_url, latitude, longitude')
            .gte('latitude', minLat)
            .lte('latitude', maxLat)
            .gte('longitude', minLng)
            .lte('longitude', maxLng)
            .not('latitude', 'is', null)
            .not('longitude', 'is', null);
            
          if (businessError) {
            console.error("Error fetching businesses:", businessError);
          } else if (businesses) {
            businesses.forEach(b => {
              // Only add businesses with valid coordinates
              if (typeof b.latitude === 'number' && typeof b.longitude === 'number') {
                items.push({
                  id: b.id,
                  name: b.name,
                  description: b.description,
                  image_url: b.image_url || '',
                  latitude: b.latitude,
                  longitude: b.longitude,
                  type: 'business'
                });
              }
            });
          }
        }
        
        // Only fetch products if filter is 'all' or 'product'
        if (activeFilter === 'all' || activeFilter === 'product') {
          const { data: products, error: productError } = await supabase
            .from('products')
            .select('id, title, description, image_url, latitude, longitude')
            .gte('latitude', minLat)
            .lte('latitude', maxLat)
            .gte('longitude', minLng)
            .lte('longitude', maxLng)
            .not('latitude', 'is', null)
            .not('longitude', 'is', null);
            
          if (productError) {
            console.error("Error fetching products:", productError);
          } else if (products) {
            products.forEach(p => {
              // Only add products with valid coordinates
              if (typeof p.latitude === 'number' && typeof p.longitude === 'number') {
                items.push({
                  id: p.id,
                  name: p.title || '',
                  description: p.description,
                  image_url: p.image_url || '',
                  latitude: p.latitude,
                  longitude: p.longitude,
                  type: 'product'
                });
              }
            });
          }
        }
        
        // Only fetch services if filter is 'all' or 'service'
        if (activeFilter === 'all' || activeFilter === 'service') {
          const { data: services, error: serviceError } = await supabase
            .from('services')
            .select('id, title, description, image_url, latitude, longitude')
            .gte('latitude', minLat)
            .lte('latitude', maxLat)
            .gte('longitude', minLng)
            .lte('longitude', maxLng)
            .not('latitude', 'is', null)
            .not('longitude', 'is', null);
            
          if (serviceError) {
            console.error("Error fetching services:", serviceError);
          } else if (services) {
            services.forEach(s => {
              // Only add services with valid coordinates
              if (typeof s.latitude === 'number' && typeof s.longitude === 'number') {
                items.push({
                  id: s.id,
                  name: s.title || '',
                  title: s.title,
                  description: s.description,
                  image_url: s.image_url || '',
                  latitude: s.latitude,
                  longitude: s.longitude,
                  type: 'service'
                });
              }
            });
          }
        }
      } catch (error) {
        console.error("Error fetching nearby items:", error);
      }
      
      return items;
    },
    enabled: !!position
  });
  
  // Filter nearby items based on selected filter
  const filteredNearbyItems = activeFilter === 'all' 
    ? nearbyItems 
    : nearbyItems.filter(item => item.type === activeFilter);
  
  const handleDetectLocation = () => {
    requestGeolocation();
    toast.info("Detecting your location...");
  };
  
  const handleMarkerClick = (item: NearbyItem) => {
    setSelectedItem(item);
    setMapCenter({ lat: item.latitude, lng: item.longitude });
  };
  
  const handleFilterChange = (filter: 'all' | 'business' | 'product' | 'service') => {
    setActiveFilter(filter);
  };

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left sidebar */}
          <div className="w-full md:w-1/3 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center justify-between">
                  <span>Location</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleDetectLocation}
                    disabled={geoLoading}
                  >
                    {geoLoading ? (
                      <Locate className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Locate className="h-4 w-4 mr-2" />
                    )}
                    {geoLoading ? "Detecting..." : "Detect"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <MapPin className="h-5 w-5 text-primary mr-2" />
                  <div>
                    <h3 className="font-medium">{currentLocation}</h3>
                    <p className="text-sm text-muted-foreground">
                      {isLocationAvailable 
                        ? "Zructures is available here" 
                        : "Zructures is coming soon"}
                    </p>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => setShowLocationPicker(true)}
                >
                  Change Location
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Filter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={activeFilter === 'all' ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange('all')}
                  >
                    <ListFilter className="h-4 w-4 mr-2" />
                    All
                  </Button>
                  
                  <Button 
                    variant={activeFilter === 'business' ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange('business')}
                  >
                    <Store className="h-4 w-4 mr-2" />
                    Businesses
                  </Button>
                  
                  <Button 
                    variant={activeFilter === 'product' ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange('product')}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Products
                  </Button>
                  
                  <Button 
                    variant={activeFilter === 'service' ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange('service')}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Services
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Nearby items list */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Nearby</CardTitle>
              </CardHeader>
              <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
                {geoLoading || loadingNearby ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : filteredNearbyItems.length > 0 ? (
                  filteredNearbyItems.map(item => (
                    <div 
                      key={`${item.type}-${item.id}`}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${
                        selectedItem?.id === item.id ? 'border-primary bg-muted/30' : 'hover:bg-muted/10'
                      }`}
                      onClick={() => handleMarkerClick(item)}
                    >
                      <div className="flex items-center gap-3">
                        {item.image_url ? (
                          <img 
                            src={item.image_url} 
                            alt={item.name} 
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                            {item.type === 'business' && <Store className="h-6 w-6 text-muted-foreground" />}
                            {item.type === 'product' && <ShoppingBag className="h-6 w-6 text-muted-foreground" />}
                            {item.type === 'service' && <Briefcase className="h-6 w-6 text-muted-foreground" />}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{item.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                          <Badge variant="outline" className="mt-1">
                            {item.type === 'business' && "Business"}
                            {item.type === 'product' && "Product"}
                            {item.type === 'service' && "Service"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : !position ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Please enable location services to see nearby items</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No nearby items found
                  </div>
                )}
              </div>
            </Card>
          </div>
          
          {/* Map area */}
          <div className="w-full md:w-2/3 h-[600px]">
            <LocationMap 
              className="w-full h-full" 
              center={mapCenter}
              businesses={nearbyItems.filter(item => item.type === 'business')}
              products={nearbyItems.filter(item => item.type === 'product')}
              services={nearbyItems.filter(item => item.type === 'service')}
              onMarkerClick={handleMarkerClick}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
