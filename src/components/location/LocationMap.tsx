
import { useState, useEffect, useRef, useCallback, memo } from "react";
import { MapPin, Layers, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useLocation } from "@/providers/LocationProvider";
import { isMobileDevice } from "@/utils/locationUtils";

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
    googleMapsLoaded: boolean;
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

// Use memo to prevent unnecessary re-renders
export const LocationMap = memo(({
  className = "",
  businesses = [],
  services = [],
  products = [],
  onMarkerClick,
  center,
  zoom = 14
}: LocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([]);
  const { requestGeolocation, position } = useGeolocation();
  const [mapZoom, setMapZoom] = useState(zoom);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isScriptLoading, setIsScriptLoading] = useState(false);
  const { latitude, longitude } = useLocation();
  const isMobile = isMobileDevice();
  const hasInitialized = useRef(false);
  
  // Clean up markers when component unmounts
  useEffect(() => {
    return () => {
      mapMarkers.forEach(marker => marker.setMap(null));
    };
  }, [mapMarkers]);

  // Load Google Maps script efficiently - once per page load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if script is already being loaded or has loaded
      if (window.googleMapsLoaded || isScriptLoading || document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {
        if (window.google?.maps) {
          initializeMap();
        }
        return;
      }
      
      // Load script if not already loaded or loading
      setIsScriptLoading(true);
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBky_ax9Xw9iNRRWMwbdqXzneYgbO6iarI&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      // Create global init function only once
      if (!window.initMap) {
        window.initMap = () => {
          window.googleMapsLoaded = true;
          window.dispatchEvent(new Event('google-maps-loaded'));
        };
      }
      
      // Listen for script load event
      script.onload = () => {
        setIsScriptLoading(false);
      };
      
      script.onerror = (error) => {
        console.error("Error loading Google Maps API:", error);
        setIsScriptLoading(false);
      };
      
      // Append script to document
      document.head.appendChild(script);
    }
  }, []);
  
  // Wait for google maps to load
  useEffect(() => {
    if (window.google?.maps) {
      initializeMap();
    } else {
      const handleMapsLoaded = () => {
        initializeMap();
      };
      
      window.addEventListener('google-maps-loaded', handleMapsLoaded);
      return () => {
        window.removeEventListener('google-maps-loaded', handleMapsLoaded);
      };
    }
  }, []);
  
  // Initialize map function
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google?.maps || hasInitialized.current) return;
    
    hasInitialized.current = true;
    
    const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Center of India
    const userCenter = center || 
      (position ? { lat: position.latitude, lng: position.longitude } : undefined) ||
      (latitude && longitude ? { lat: latitude, lng: longitude } : undefined) ||
      defaultCenter;
    
    // Simplified map options for better performance
    const mapOptions: google.maps.MapOptions = {
      center: userCenter,
      zoom: mapZoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: false,
      gestureHandling: "cooperative", // Improves mobile performance
      disableDefaultUI: true, // Minimize UI elements for performance
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "transit",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    };
    
    const map = new window.google.maps.Map(mapRef.current, mapOptions);
    
    // Optimize map rendering
    map.addListener('tilesloaded', () => {
      setIsMapLoaded(true);
    });
    
    setMapInstance(map);
    
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
      
      // Add a circle for accuracy - only if on mobile
      if (isMobile && position?.accuracy) {
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
  }, [position, center, mapZoom, latitude, longitude, isMobile]);

  // Update map center when it changes
  useEffect(() => {
    if (mapInstance && center) {
      mapInstance.setCenter(center);
    }
  }, [center, mapInstance]);
  
  // Update markers only once map is initialized
  useEffect(() => {
    if (!mapInstance || !isMapLoaded) return;
    
    // Clear existing markers
    mapMarkers.forEach(marker => marker.setMap(null));
    
    // Batch all marker creation operations to reduce reflows
    const newMarkers: google.maps.Marker[] = [];
    
    // Optimize marker creation by batching
    const batchSize = 10;
    
    // Helper function to create markers in batches
    const createMarkersBatch = (items: any[], color: string, type: string, startIndex: number) => {
      const endIndex = Math.min(startIndex + batchSize, items.length);
      
      for (let i = startIndex; i < endIndex; i++) {
        const item = items[i];
        if (!item.latitude || !item.longitude) continue;
        
        const marker = new window.google.maps.Marker({
          position: { lat: item.latitude, lng: item.longitude },
          map: mapInstance,
          title: item.name || item.title,
          // Use optimized SVG path for markers
          icon: {
            path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            fillColor: color,
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: "#FFFFFF",
            scale: 5
          }
        });
        
        if (onMarkerClick) {
          marker.addListener("click", () => onMarkerClick(item));
        }
        
        newMarkers.push(marker);
      }
      
      // If there are more items to process, schedule the next batch
      if (endIndex < items.length) {
        setTimeout(() => {
          createMarkersBatch(items, color, type, endIndex);
        }, 0);
      }
    };
    
    // Start creating markers in batches
    if (businesses.length > 0) {
      createMarkersBatch(businesses, "#FF5722", "business", 0);
    }
    
    if (services.length > 0) {
      createMarkersBatch(services, "#4CAF50", "service", 0);
    }
    
    if (products.length > 0) {
      createMarkersBatch(products, "#2196F3", "product", 0);
    }
    
    setMapMarkers(newMarkers);
  }, [businesses, services, products, mapInstance, isMapLoaded, onMarkerClick]);
  
  // Zoom controls
  const handleZoomIn = useCallback(() => {
    if (mapInstance) {
      const newZoom = mapInstance.getZoom() + 1;
      mapInstance.setZoom(newZoom);
      setMapZoom(newZoom);
    }
  }, [mapInstance]);

  const handleZoomOut = useCallback(() => {
    if (mapInstance) {
      const newZoom = mapInstance.getZoom() - 1;
      mapInstance.setZoom(newZoom);
      setMapZoom(newZoom);
    }
  }, [mapInstance]);
  
  const handleMyLocation = useCallback(() => {
    if (mapInstance) {
      // On desktop, use the manual request
      requestGeolocation();
      
      if (position) {
        mapInstance.panTo({ lat: position.latitude, lng: position.longitude });
        mapInstance.setZoom(17);
        setMapZoom(17);
      } else if (latitude && longitude) {
        mapInstance.panTo({ lat: latitude, lng: longitude });
        mapInstance.setZoom(17);
        setMapZoom(17);
      }
    }
  }, [mapInstance, position, requestGeolocation, latitude, longitude]);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[300px] rounded-lg overflow-hidden"
        style={{ willChange: "transform" }} // Performance optimization
      />
      
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
      
      {/* Loading overlay - only show briefly */}
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
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
});

export default LocationMap;
