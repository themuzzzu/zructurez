
import { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";

interface MapDisplayProps {
  onLocationSelect: (location: string) => void;
  searchInput: string;
}

export const MapDisplay = ({ onLocationSelect }: MapDisplayProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Set default location
    onLocationSelect("Tadipatri, Andhra Pradesh 515411");
    
    // Simulate map loading with a lighter approach
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Reduced loading time

    return () => clearTimeout(timer);
  }, [onLocationSelect]);

  const handleMapLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="w-full h-[400px] rounded-md border bg-gray-50 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-sm text-muted-foreground">Loading map...</p>
          </div>
        )}
        <iframe 
          ref={mapRef}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30844.733356070145!2d78.00200075!3d14.90409405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb41cadcd3b8d9f%3A0xd1bff73d9d4719fc!2sTadipatri%2C%20Andhra%20Pradesh%20515411!5e0!3m2!1sen!2sin!4v1735109120186!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy" 
          onLoad={handleMapLoad}
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};
