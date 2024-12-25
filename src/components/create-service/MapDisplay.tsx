import { useEffect, useRef } from "react";
import { createMapInstance, createMarker, initializeGeocoder, initializeAutocomplete, TADIPATRI_CENTER } from "./map-utils";
import { toast } from "sonner";

interface MapDisplayProps {
  onLocationSelect: (location: string) => void;
  searchInput: string;
}

export const MapDisplay = ({ onLocationSelect, searchInput }: MapDisplayProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!window.google?.maps) {
      console.error('Google Maps not available');
      toast.error("Google Maps is not available. Please refresh the page.");
      return;
    }

    if (!mapRef.current) return;

    try {
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
    } catch (error) {
      console.error("Error initializing map:", error);
      toast.error("Failed to initialize map. Please try again.");
    }
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
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [onLocationSelect]);

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
        className="w-full h-[400px] rounded-md border"
      />
    </div>
  );
};