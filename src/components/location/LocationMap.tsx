import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Layers, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useLocation } from "@/providers/LocationProvider";

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

interface LocationMapProps {
  className?: string;
  businesses?: any[];
  services?: any[];
  products?: any[];
  onMarkerClick?: (item: any) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

export function LocationMap({
  className = "",
  businesses = [],
  services = [],
  products = [],
  onMarkerClick,
  center,
  zoom = 14
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([]);
  const { requestGeolocation, position } = useGeolocation();
  const [mapZoom, setMapZoom] = useState(zoom);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { latitude, longitude } = useLocation();
  
  // Clean up markers when component unmounts
  useEffect(() => {
    return () => {
      mapMarkers.forEach(marker => marker.setMap(null));
    };
  }, [mapMarkers]);

  // Initialize the map when the component mounts
  useEffect(() => {
    // Check if Google Maps API is loaded
    const loadGoogleMaps = () => {
      if (typeof window !== 'undefined' && !window.google?.maps) {
        // Create script tag
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBky_ax9Xw9iNRRWMwbdqXzneYgbO6iarI&callback=initMap`;
        script.async = true;
        script.defer = true;
        
        // Create global init function
        window.initMap = () => {
          // Dispatch event that Google Maps is loaded
          window.dispatchEvent(new Event('google-maps-loaded'));
        };
        
        // Append script to document
        document.head.appendChild(script);
      }
    };
    
    loadGoogleMaps();
    
    // Initialize map
    const initMap = () => {
      if (!mapRef.current || !window.google?.maps) return;
      
      const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Center of India
      const userCenter = center || 
        (position ? { lat: position.latitude, lng: position.longitude } : undefined) ||
        (latitude && longitude ? { lat: latitude, lng: longitude } : undefined) ||
        defaultCenter;
      
      const map = new window.google.maps.Map(mapRef.current, {
        center: userCenter,
        zoom: mapZoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });
      
      setMapInstance(map);
      setIsMapLoaded(true);
      
      // Add a marker for user's position if available
      if (position || (latitude && longitude)) {
        const userPosition = position 
          ? { lat: position.latitude, lng: position.longitude }
          : { lat: latitude as number, lng: longitude as number };
            
        new window.google.maps.Marker({
          position: userPosition,
          map,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
            scale: 8
          },
          title: "Your location"
        });
        
        // Add a circle to show accuracy
        if (position?.accuracy) {
          new window.google.maps.Circle({
            strokeColor: "#4285F4",
            strokeOpacity: 0.2,
            strokeWeight: 1,
            fillColor: "#4285F4",
            fillOpacity: 0.1,
            map,
            center: userPosition,
            radius: position.accuracy
          });
        }
      }
    };
    
    if (window.google?.maps) {
      initMap();
    } else {
      window.addEventListener('google-maps-loaded', initMap);
      return () => {
        window.removeEventListener('google-maps-loaded', initMap);
      };
    }
  }, [position, center, mapZoom, latitude, longitude]);
  
  // Update map center if it changes
  useEffect(() => {
    if (mapInstance && center) {
      mapInstance.panTo(center);
    }
  }, [center, mapInstance]);
  
  // Update markers when businesses, services, or products change
  useEffect(() => {
    if (!mapInstance || !isMapLoaded) return;
    
    // Clear existing markers
    mapMarkers.forEach(marker => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];
    
    // Add business markers
    businesses.forEach(business => {
      if (!business.latitude || !business.longitude) return;
      
      const marker = new window.google.maps.Marker({
        position: { lat: business.latitude, lng: business.longitude },
        map: mapInstance,
        title: business.name,
        icon: {
          path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          fillColor: "#FF5722",
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "#FFFFFF",
          scale: 5
        }
      });
      
      marker.addListener("click", () => {
        if (onMarkerClick) onMarkerClick(business);
      });
      
      newMarkers.push(marker);
    });
    
    // Add service markers
    services.forEach(service => {
      if (!service.latitude || !service.longitude) return;
      
      const marker = new window.google.maps.Marker({
        position: { lat: service.latitude, lng: service.longitude },
        map: mapInstance,
        title: service.title,
        icon: {
          path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          fillColor: "#4CAF50",
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "#FFFFFF",
          scale: 5
        }
      });
      
      marker.addListener("click", () => {
        if (onMarkerClick) onMarkerClick(service);
      });
      
      newMarkers.push(marker);
    });
    
    // Add product markers
    products.forEach(product => {
      if (!product.latitude || !product.longitude) return;
      
      const marker = new window.google.maps.Marker({
        position: { lat: product.latitude, lng: product.longitude },
        map: mapInstance,
        title: product.name,
        icon: {
          path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          fillColor: "#2196F3",
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "#FFFFFF",
          scale: 5
        }
      });
      
      marker.addListener("click", () => {
        if (onMarkerClick) onMarkerClick(product);
      });
      
      newMarkers.push(marker);
    });
    
    setMapMarkers(newMarkers);
  }, [businesses, services, products, mapInstance, isMapLoaded, onMarkerClick]);
  
  const handleZoomIn = useCallback(() => {
    if (mapInstance) {
      mapInstance.setZoom(mapInstance.getZoom() + 1);
      setMapZoom(mapInstance.getZoom());
    }
  }, [mapInstance]);

  const handleZoomOut = useCallback(() => {
    if (mapInstance) {
      mapInstance.setZoom(mapInstance.getZoom() - 1);
      setMapZoom(mapInstance.getZoom());
    }
  }, [mapInstance]);
  
  const handleMyLocation = useCallback(() => {
    requestGeolocation();
    if (position && mapInstance) {
      mapInstance.panTo({ lat: position.latitude, lng: position.longitude });
      mapInstance.setZoom(17);
      setMapZoom(17);
    }
  }, [mapInstance, position, requestGeolocation]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full min-h-[300px] rounded-lg overflow-hidden" />
      
      {/* Map controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-2">
        <Button 
          variant="secondary" 
          size="icon"
          className="h-8 w-8 rounded-full shadow-md bg-background/90 hover:bg-background"
          onClick={handleZoomIn}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon"
          className="h-8 w-8 rounded-full shadow-md bg-background/90 hover:bg-background"
          onClick={handleZoomOut}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon"
          className="h-8 w-8 rounded-full shadow-md bg-background/90 hover:bg-background"
          onClick={handleMyLocation}
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Loading overlay */}
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span>Loading map...</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
