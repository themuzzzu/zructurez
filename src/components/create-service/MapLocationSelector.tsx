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
    let attempts = 0;
    const maxAttempts = 20; // 10 seconds maximum wait time
    
    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps) {
        console.log('Google Maps loaded successfully');
        setIsLoading(false);
        return;
      }
      
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(checkGoogleMapsLoaded, 500);
      } else {
        console.error('Google Maps failed to load');
        toast.error("Failed to load Google Maps. Please refresh the page.");
        setIsLoading(false);
      }
    };

    // Start checking after a short delay
    setTimeout(checkGoogleMapsLoaded, 1000);

    return () => {
      attempts = maxAttempts; // Stop checking on unmount
    };
  }, []);

  const initializeMap = (container: HTMLElement) => {
    if (!window.google || !window.google.maps) {
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

      mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          marker.setPosition(e.latLng);
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode(
            { location: e.latLng },
            (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
              if (status === "OK" && results?.[0]) {
                setSelectedLocation(results[0].formatted_address);
              }
            }
          );
        }
      });

      marker.addListener("dragend", () => {
        const position = marker.getPosition();
        if (position) {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode(
            { location: position },
            (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
              if (status === "OK" && results?.[0]) {
                setSelectedLocation(results[0].formatted_address);
              }
            }
          );
        }
      });

      console.log('Map initialized successfully');
      setMap(mapInstance);
    } catch (error) {
      console.error("Error initializing map:", error);
      toast.error("Failed to initialize map. Please try again.");
    }
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