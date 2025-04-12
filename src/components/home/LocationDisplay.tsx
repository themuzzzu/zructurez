
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Locate, Navigation, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useLocation } from "@/providers/LocationProvider";

interface LocationDisplayProps {
  className?: string;
}

export function LocationDisplay({ className = "" }: LocationDisplayProps) {
  const navigate = useNavigate();
  const { requestGeolocation, loading } = useGeolocation();
  const { currentLocation, setShowLocationPicker, isLocationAvailable } = useLocation();
  
  // Don't show this component if location is not set
  if (currentLocation === "All India") {
    return null;
  }

  const handleDetectLocation = () => {
    requestGeolocation();
  };

  return (
    <Card className={`${className} border border-dashed animate-fade-in overflow-hidden transition-all hover:shadow-md`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className={`h-5 w-5 ${isLocationAvailable ? 'text-primary' : 'text-amber-500'}`} />
            <h3 className="font-medium">You're browsing from</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs"
            onClick={handleDetectLocation}
            disabled={loading}
          >
            {loading ? (
              <Locate className="h-3 w-3 animate-spin mr-1" />
            ) : (
              <Navigation className="h-3 w-3 mr-1" />
            )}
            {loading ? "Detecting..." : "Detect"}
          </Button>
        </div>
        
        <div className="mt-1 mb-2">
          <p className="font-semibold text-lg flex items-center">
            {currentLocation}
          </p>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          {isLocationAvailable 
            ? "We're showing you businesses and services near your location." 
            : "Zructures is not fully available in this area yet, but you can browse in limited mode."}
        </p>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => setShowLocationPicker(true)}
          >
            Change Location
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => navigate("/maps")}
          >
            <MapIcon className="h-4 w-4 mr-1" />
            View Map
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
