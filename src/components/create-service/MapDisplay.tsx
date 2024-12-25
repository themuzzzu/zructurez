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

      // Initialize geocoder for initial location
      initializeGeocoder(
        new google.maps.LatLng(TADIPATRI_CENTER.lat, TADIPATRI_CENTER.lng),
        onLocationSelect
      );

      // Initialize autocomplete if search input is available
      if (searchInputRef.current) {
        initializeAutocomplete(searchInputRef.current, map, marker, onLocationSelect);
      }

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

  return (
    <div 
      ref={mapRef}
      className="w-full h-[400px] rounded-md border"
    />
  );
};