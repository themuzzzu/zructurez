import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Input } from "../ui/input";

interface MapDisplayProps {
  onLocationSelect: (location: string) => void;
  searchInput: string;
}

export const MapDisplay = ({ onLocationSelect, searchInput }: MapDisplayProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [mapUrl, setMapUrl] = useState("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30844.73348794849!2d77.9814011018522!3d14.904093129595012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb41cadcd3b8d9f%3A0xd1bff73d9d4719fc!2sTadipatri%2C%20Andhra%20Pradesh%20515411!5e0!3m2!1sen!2sin!4v1735108282438!5m2!1sen!2sin");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLocationSelect = () => {
    if (searchInputRef.current?.value) {
      const location = searchInputRef.current.value;
      onLocationSelect(location);
      // Update map URL with the searched location
      const encodedLocation = encodeURIComponent(location);
      const newMapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBOnx38SUqt4hNkRh_DQsyGPQz_-bFvwLk&q=${encodedLocation}`;
      setMapUrl(newMapUrl);
      toast.success("Location selected successfully");
    }
  };

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
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Search for a location..."
          className="w-full px-4 py-2"
          defaultValue={searchInput}
          onChange={handleLocationSelect}
        />
      </div>
      <div className="w-full h-[400px] rounded-md border bg-gray-50 overflow-hidden">
        <iframe 
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="text-sm text-muted-foreground">
        Enter a location in the search box to update the map
      </div>
    </div>
  );
};