import { useEffect, useRef, useState } from "react";
import { createMapInstance, createMarker, initializeGeocoder, initializeAutocomplete, TADIPATRI_CENTER } from "./map-utils";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface MapDisplayProps {
  onLocationSelect: (location: string) => void;
  searchInput: string;
}

export const MapDisplay = ({ onLocationSelect, searchInput }: MapDisplayProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) {
        console.error('Map container not found');
        return;
      }

      try {
        // Check if Google Maps API is loaded
        if (typeof google === 'undefined') {
          console.error('Google Maps API not loaded');
          toast.error("Google Maps is not available. Please refresh the page.");
          return;
        }

        console.log('Initializing map...');
        const map = createMapInstance(mapRef.current);
        const marker = createMarker(map);
        
        mapInstanceRef.current = map;
        markerRef.current = marker;

        // Initialize geocoder for initial location
        initializeGeocoder(
          new google.maps.LatLng(TADIPATRI_CENTER.lat, TADIPATRI_CENTER.lng),
          onLocationSelect
        );

        // Handle map clicks
        map.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            marker.setPosition(e.latLng);
            initializeGeocoder(e.latLng, onLocationSelect);
          }
        });

        // Handle marker drag
        marker.addListener("dragend", () => {
          const position = marker.getPosition();
          if (position) {
            initializeGeocoder(position, onLocationSelect);
          }
        });

        console.log('Map initialized successfully');
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing map:", error);
        toast.error("Failed to initialize map. Please try again.");
      }
    };

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeMap();
    }, 100);

    return () => clearTimeout(timer);
  }, [onLocationSelect]);

  // Update map when search input changes
  useEffect(() => {
    if (!searchInputRef.current || !mapInstanceRef.current || !markerRef.current) return;

    const map = mapInstanceRef.current;
    const marker = markerRef.current;

    // Initialize autocomplete
    const autocomplete = initializeAutocomplete(
      searchInputRef.current,
      map,
      marker,
      onLocationSelect
    );

    return () => {
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [onLocationSelect]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 min-h-[400px] bg-gray-50 rounded-md border">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search for a location..."
          className="w-full px-4 py-2 border rounded-md"
          defaultValue={searchInput}
        />
      </div>
      <div 
        ref={mapRef}
        className="w-full h-[400px] rounded-md border bg-gray-50"
        style={{ display: 'block' }}
      />
    </div>
  );
};