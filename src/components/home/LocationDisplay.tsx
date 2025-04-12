
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LocationDisplayProps {
  className?: string;
}

export function LocationDisplay({ className = "" }: LocationDisplayProps) {
  const [location, setLocation] = useState(localStorage.getItem('userLocation') || "All India");
  const navigate = useNavigate();

  useEffect(() => {
    const handleLocationUpdated = (event: CustomEvent) => {
      if (event.detail.location) {
        setLocation(event.detail.location);
      }
    };

    window.addEventListener('locationUpdated', handleLocationUpdated as EventListener);
    
    return () => {
      window.removeEventListener('locationUpdated', handleLocationUpdated as EventListener);
    };
  }, []);

  return (
    <Card className={`${className} border border-dashed animate-fade-in overflow-hidden transition-all hover:shadow-md`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="font-medium">You're browsing from</h3>
        </div>
        
        <div className="mt-1 mb-2">
          <p className="font-semibold text-lg">{location}</p>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          We're showing you businesses and services near your location.
        </p>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => navigate("/settings?tab=location")}
        >
          Change Location
        </Button>
      </CardContent>
    </Card>
  );
}
