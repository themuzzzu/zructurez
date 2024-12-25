import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

interface MapLocationSelectorProps {
  value: string;
  onChange: (location: string) => void;
}

export const MapLocationSelector = ({ value, onChange }: MapLocationSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>(value);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleGoogleMapsLoaded = () => {
      console.log('Maps loaded event received');
      setIsLoading(false);
    };

    if (window.google?.maps) {
      console.log('Maps already loaded');
      setIsLoading(false);
    }

    window.addEventListener('google-maps-loaded', handleGoogleMapsLoaded);
    
    return () => {
      window.removeEventListener('google-maps-loaded', handleGoogleMapsLoaded);
    };
  }, []);

  const initializeMap = (container: HTMLElement) => {
    if (!window.google?.maps) {
      console.error('Google Maps not available');
      toast.error("Google Maps is not available. Please refresh the page.");
      return;
    }

    try {
      console.log('Initializing map...');
      const mapInstance = new google.maps.Map(container, {
        center: { lat: 14.9041, lng: 77.9813 }, // Tadipatri coordinates
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
      });

      const marker = new google.maps.Marker({
        map: mapInstance,
        draggable: true,
        position: mapInstance.getCenter(),
      });

      // Handle map clicks
      mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          marker.setPosition(e.latLng);
          updateLocationFromLatLng(e.latLng);
        }
      });

      // Handle marker drag
      marker.addListener("dragend", () => {
        const position = marker.getPosition();
        if (position) {
          updateLocationFromLatLng(position);
        }
      });

      console.log('Map initialized successfully');
      setMap(mapInstance);
    } catch (error) {
      console.error("Error initializing map:", error);
      toast.error("Failed to initialize map. Please try again.");
    }
  };

  const updateLocationFromLatLng = (latLng: google.maps.LatLng) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { location: latLng },
      (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
        if (status === "OK" && results?.[0]) {
          setSelectedLocation(results[0].formatted_address);
        }
      }
    );
  };

  const handleConfirm = () => {
    onChange(selectedLocation);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start gap-2"
        disabled
      >
        <MapPin className="h-4 w-4" />
        Loading map...
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start gap-2"
        onClick={() => setIsOpen(true)}
      >
        <MapPin className="h-4 w-4" />
        {value || "Select location from map..."}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Select Location</DialogTitle>
          </DialogHeader>
          
          <div 
            id="map" 
            className="w-full h-[400px] rounded-md border mb-4"
            ref={(el) => el && !map && initializeMap(el)}
          />

          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedLocation || "Click or drag the marker on the map to select a location"}
            </div>
            <Button onClick={handleConfirm}>Confirm Location</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};