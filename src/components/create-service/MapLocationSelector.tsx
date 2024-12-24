import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

interface MapLocationSelectorProps {
  value: string;
  onChange: (location: string) => void;
}

export const MapLocationSelector = ({ value, onChange }: MapLocationSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [locationName, setLocationName] = useState(value || "");
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!open || !mapRef.current) return;

    // Initialize the map
    const defaultLocation: google.maps.LatLngLiteral = { lat: 14.904093, lng: 77.981401 }; // Tadipatri coordinates
    const mapOptions: google.maps.MapOptions = {
      center: defaultLocation,
      zoom: 14,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    };

    // Create the map instance
    const map = new google.maps.Map(mapRef.current, mapOptions);
    mapInstanceRef.current = map;

    // Create a marker for the default location
    const marker = new google.maps.Marker({
      position: defaultLocation,
      map: map,
      draggable: true,
      title: "Drag to select location",
    });
    markerRef.current = marker;

    // Add click listener to the map
    map.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      
      marker.setPosition(e.latLng);
      setSelectedLocation({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
      
      // Get address for the selected location
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: e.latLng },
        (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
          if (status === "OK" && results[0]) {
            setLocationName(results[0].formatted_address);
          } else {
            toast.error("Could not find address for this location");
          }
        }
      );
    });

    // Add dragend listener to the marker
    marker.addListener("dragend", () => {
      const position = marker.getPosition();
      if (!position) return;

      setSelectedLocation({
        lat: position.lat(),
        lng: position.lng(),
      });

      // Get address for the dragged location
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: position },
        (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
          if (status === "OK" && results[0]) {
            setLocationName(results[0].formatted_address);
          } else {
            toast.error("Could not find address for this location");
          }
        }
      );
    });

    return () => {
      // Cleanup
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      mapInstanceRef.current = null;
    };
  }, [open]);

  const handleLocationSelect = () => {
    if (locationName) {
      onChange(locationName);
      setOpen(false);
    } else {
      toast.error("Please select a location on the map");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button" className="w-full justify-start gap-2">
          <MapPin className="h-4 w-4" />
          {value || "Select location from map..."}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Location</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
            <div ref={mapRef} className="w-full h-full" />
          </div>
          {locationName && (
            <div className="px-4 py-2 bg-muted rounded-lg">
              <p className="text-sm">Selected location: {locationName}</p>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleLocationSelect}>Select Location</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};