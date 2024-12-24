import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { MapPin } from "lucide-react";

interface MapLocationSelectorProps {
  value: string;
  onChange: (location: string) => void;
}

export const MapLocationSelector = ({ value, onChange }: MapLocationSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>(value);

  const initializeMap = (container: HTMLElement) => {
    const mapInstance = new google.maps.Map(container, {
      center: { lat: 14.9041, lng: 77.9813 }, // Tadipatri coordinates
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
    });

    mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: e.latLng },
        (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
          if (status === "OK" && results?.[0]) {
            setSelectedLocation(results[0].formatted_address);
          }
        }
      );
    });

    setMap(mapInstance);
  };

  const handleConfirm = () => {
    onChange(selectedLocation);
    setIsOpen(false);
  };

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
              {selectedLocation || "Click on the map to select a location"}
            </div>
            <Button onClick={handleConfirm}>Confirm Location</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};