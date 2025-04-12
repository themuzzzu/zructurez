
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { LocationMap } from "@/components/location/LocationMap";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Store, 
  Wrench, 
  ShoppingBag, 
  User, 
  Building, 
  Clock, 
  MapPinOff
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useGeolocation } from "@/hooks/useGeolocation";
import { EnhancedLocationSelector } from "@/components/location/EnhancedLocationSelector";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function MapView() {
  const [activeTab, setActiveTab] = useState<"all" | "businesses" | "services" | "products">("all");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt" | "unknown">("unknown");
  const [radiusFilter, setRadiusFilter] = useState(5);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [userLocation, setUserLocation] = useState(localStorage.getItem('userLocation') || "All India");
  const [mapItems, setMapItems] = useState<{
    businesses: any[];
    services: any[];
    products: any[];
  }>({
    businesses: [],
    services: [],
    products: []
  });
  const { requestGeolocation, loading, position } = useGeolocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check location permission
    const checkPermission = async () => {
      if (!("permissions" in navigator)) return;
      
      try {
        const permission = await navigator.permissions.query({ name: "geolocation" as PermissionName });
        setLocationPermission(permission.state as "granted" | "denied" | "prompt");
        
        permission.onchange = function() {
          setLocationPermission(this.state as "granted" | "denied" | "prompt");
        };
      } catch (error) {
        console.error("Error checking geolocation permission:", error);
      }
    };
    
    checkPermission();
    
    // For demo purposes, generate some mock items with coordinates
    const mockBusinesses = Array.from({ length: 15 }, (_, i) => ({
      id: `business-${i}`,
      name: `Business ${i+1}`,
      category: ["Restaurant", "Retail", "Services", "Healthcare", "Entertainment"][i % 5],
      rating: (Math.random() * 3 + 2).toFixed(1),
      image_url: null,
      latitude: position ? position.latitude + (Math.random() - 0.5) * 0.02 : 20.59 + (Math.random() - 0.5) * 0.1,
      longitude: position ? position.longitude + (Math.random() - 0.5) * 0.02 : 78.96 + (Math.random() - 0.5) * 0.1,
      distance: Math.round(Math.random() * 900 + 100)
    }));
    
    const mockServices = Array.from({ length: 10 }, (_, i) => ({
      id: `service-${i}`,
      title: `Service ${i+1}`,
      category: ["Plumbing", "Electrical", "Cleaning", "Tutoring", "Delivery"][i % 5],
      price: Math.round(Math.random() * 400 + 100),
      image_url: null,
      latitude: position ? position.latitude + (Math.random() - 0.5) * 0.015 : 20.59 + (Math.random() - 0.5) * 0.1,
      longitude: position ? position.longitude + (Math.random() - 0.5) * 0.015 : 78.96 + (Math.random() - 0.5) * 0.1,
      distance: Math.round(Math.random() * 900 + 100)
    }));
    
    const mockProducts = Array.from({ length: 8 }, (_, i) => ({
      id: `product-${i}`,
      name: `Product ${i+1}`,
      category: ["Electronics", "Furniture", "Clothing", "Books", "Toys"][i % 5],
      price: Math.round(Math.random() * 1000 + 500),
      image_url: null,
      latitude: position ? position.latitude + (Math.random() - 0.5) * 0.01 : 20.59 + (Math.random() - 0.5) * 0.1,
      longitude: position ? position.longitude + (Math.random() - 0.5) * 0.01 : 78.96 + (Math.random() - 0.5) * 0.1,
      distance: Math.round(Math.random() * 900 + 100)
    }));
    
    setMapItems({
      businesses: mockBusinesses,
      services: mockServices,
      products: mockProducts
    });
  }, [position]);
  
  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setShowItemDetails(true);
  };
  
  const handleLocationUpdate = () => {
    if (locationPermission === "denied") {
      toast.error("Location permission denied. Please enable location in your browser settings.");
      return;
    }
    
    requestGeolocation();
  };
  
  const handleLocationChange = (newLocation: string) => {
    setUserLocation(newLocation);
    localStorage.setItem('userLocation', newLocation);
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('locationUpdated', { 
      detail: { location: newLocation } 
    }));
    
    setShowLocationSelector(false);
    toast.success(`Location updated to ${newLocation}`);
  };
  
  const filteredBusinesses = activeTab === "all" || activeTab === "businesses" ? mapItems.businesses : [];
  const filteredServices = activeTab === "all" || activeTab === "services" ? mapItems.services : [];
  const filteredProducts = activeTab === "all" || activeTab === "products" ? mapItems.products : [];
  
  const handleViewDetails = (item: any) => {
    const type = item.id.split('-')[0];
    
    switch (type) {
      case 'business':
        navigate(`/business/${item.id}`);
        break;
      case 'service':
        navigate(`/services/${item.id}`);
        break;
      case 'product':
        navigate(`/marketplace/product/${item.id}`);
        break;
      default:
        console.error("Unknown item type", item);
    }
  };

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Explore Nearby
          </h1>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
              onClick={handleLocationUpdate}
              disabled={loading || locationPermission === "denied"}
            >
              {loading ? (
                <>
                  <div className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  {locationPermission === "denied" ? (
                    <MapPinOff className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  <span>Update Location</span>
                </>
              )}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm">
                  Filter ({radiusFilter}km)
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <h4 className="font-medium mb-2">Distance Filter</h4>
                  <RadioGroup 
                    value={radiusFilter.toString()} 
                    onValueChange={(value) => setRadiusFilter(parseInt(value))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="r-1" />
                      <Label htmlFor="r-1">1 km</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="r-5" />
                      <Label htmlFor="r-5">5 km</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="10" id="r-10" />
                      <Label htmlFor="r-10">10 km</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="25" id="r-25" />
                      <Label htmlFor="r-25">25 km</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="50" id="r-50" />
                      <Label htmlFor="r-50">50 km</Label>
                    </div>
                  </RadioGroup>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              onClick={() => setShowLocationSelector(true)}
            >
              {userLocation}
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Button
            variant={activeTab === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("all")}
            className="whitespace-nowrap"
          >
            All ({filteredBusinesses.length + filteredServices.length + filteredProducts.length})
          </Button>
          <Button
            variant={activeTab === "businesses" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("businesses")}
            className="whitespace-nowrap"
          >
            <Store className="h-4 w-4 mr-1.5" />
            Businesses ({mapItems.businesses.length})
          </Button>
          <Button
            variant={activeTab === "services" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("services")}
            className="whitespace-nowrap"
          >
            <Wrench className="h-4 w-4 mr-1.5" />
            Services ({mapItems.services.length})
          </Button>
          <Button
            variant={activeTab === "products" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("products")}
            className="whitespace-nowrap"
          >
            <ShoppingBag className="h-4 w-4 mr-1.5" />
            Products ({mapItems.products.length})
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <LocationMap 
              className="h-[600px] w-full rounded-lg border shadow-sm"
              businesses={filteredBusinesses}
              services={filteredServices}
              products={filteredProducts}
              onMarkerClick={handleItemClick}
              center={position ? { lat: position.latitude, lng: position.longitude } : undefined}
            />
          </div>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            <h3 className="font-medium text-lg sticky top-0 bg-background pt-1 pb-2 border-b z-10">
              Nearby {activeTab === "all" ? "Places" : activeTab}
            </h3>
            
            {filteredBusinesses.length === 0 && 
             filteredServices.length === 0 && 
             filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <MapPinOff className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium">No items found nearby</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your location or increasing the search radius
                </p>
              </div>
            )}
            
            {filteredBusinesses.map(business => (
              <Card key={business.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleItemClick(business)}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium line-clamp-1">{business.name}</h3>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Badge variant="outline" className="mr-2 text-[10px] h-4 px-1">
                          {business.category}
                        </Badge>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-0.5" />
                          {business.distance}m
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredServices.map(service => (
              <Card key={service.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleItemClick(service)}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Wrench className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium line-clamp-1">{service.title}</h3>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Badge variant="outline" className="mr-2 text-[10px] h-4 px-1">
                          {service.category}
                        </Badge>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-0.5" />
                          {service.distance}m
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredProducts.map(product => (
              <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleItemClick(product)}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium line-clamp-1">{product.name}</h3>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Badge variant="outline" className="mr-2 text-[10px] h-4 px-1">
                          {product.category}
                        </Badge>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-0.5" />
                          {product.distance}m
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Item details dialog */}
      <Dialog open={showItemDetails} onOpenChange={setShowItemDetails}>
        <DialogContent>
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedItem.name || selectedItem.title}
                </DialogTitle>
                <DialogDescription>
                  {selectedItem.category}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-3 py-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedItem.distance}m away</span>
                </div>
                
                {selectedItem.price && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">₹{selectedItem.price.toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                {selectedItem.rating && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="flex items-center">
                      {Array.from({ length: Math.floor(selectedItem.rating) }).map((_, i) => (
                        <svg key={i} className="h-4 w-4 fill-primary" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                      <span className="ml-1">{selectedItem.rating}</span>
                    </span>
                  </div>
                )}
                
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    This is a sample description for {selectedItem.name || selectedItem.title}.
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowItemDetails(false)}>
                  Close
                </Button>
                <Button onClick={() => handleViewDetails(selectedItem)}>
                  View Details
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Location selector dialog */}
      <Dialog open={showLocationSelector} onOpenChange={setShowLocationSelector}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Your Location</DialogTitle>
            <DialogDescription>
              Choose a location to see relevant content
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <EnhancedLocationSelector
              value={userLocation}
              onChange={handleLocationChange}
              showDetect={true}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLocationSelector(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
