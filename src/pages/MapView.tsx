
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, MapPin, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "@/providers/LocationProvider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGeolocation } from "@/hooks/useGeolocation";
import { toast } from "sonner";

const MapView = () => {
  const navigate = useNavigate();
  const { currentLocation } = useLocation();
  const { 
    position, 
    loading, 
    requestGeolocation,
    streetName,
    cityName,
    stateName,
    fullAddress
  } = useGeolocation();
  
  const [isLoading, setIsLoading] = useState(true);
  const [detectedPreciseLocation, setDetectedPreciseLocation] = useState<string | null>(null);
  
  // Handle initial loading and location detection
  useEffect(() => {
    let timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    // If we already have position data, try to show precise location
    if (position) {
      setIsLoading(false);
      clearTimeout(timeout);
    }
    
    return () => clearTimeout(timeout);
  }, [position]);

  // Update detected location when geolocation hook data changes
  useEffect(() => {
    if (streetName && cityName) {
      setDetectedPreciseLocation(`${streetName}, ${cityName}`);
    } else if (fullAddress) {
      setDetectedPreciseLocation(fullAddress);
    } else if (cityName) {
      setDetectedPreciseLocation(cityName);
    }
  }, [streetName, cityName, fullAddress]);

  // Format coordinates for display
  const formatCoordinate = (coord: number): string => {
    return coord.toFixed(6);
  };

  // Handle detect location button click
  const handleDetectLocation = () => {
    setIsLoading(true);
    requestGeolocation();
    toast.success("Detecting your precise location...");
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-[1400px] pt-20 pb-16 px-4">
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold animate-fade-up">
                {detectedPreciseLocation || currentLocation || "Local Area Map"}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {detectedPreciseLocation ? `Detected: ${detectedPreciseLocation}` : "Explore your local area"}
              </p>
              
              {position && (
                <div className="text-xs text-muted-foreground mt-1">
                  Coordinates: {formatCoordinate(position.latitude)}, {formatCoordinate(position.longitude)}
                  {position.accuracy && ` (Accuracy: ±${Math.round(position.accuracy)}m)`}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={handleDetectLocation}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Navigation className="h-4 w-4" />
                )}
                {loading ? "Detecting..." : "Update Location"}
              </Button>
              <Badge variant="outline" className="px-2 py-1">
                Using OpenStreetMap
              </Badge>
            </div>
          </div>

          {isLoading || loading ? (
            <Card className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p>Loading map and detecting precise location...</p>
              </div>
            </Card>
          ) : (
            <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg animate-fade-up">
              <iframe 
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${position ? (position.longitude - 0.01) : 77.96}%2C${position ? (position.latitude - 0.01) : 14.89}%2C${position ? (position.longitude + 0.01) : 78.00}%2C${position ? (position.latitude + 0.01) : 14.92}&layer=mapnik&marker=${position?.latitude || 14.904093}%2C${position?.longitude || 77.981401}`}
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight={0} 
                marginWidth={0} 
                title="OpenStreetMap"
                style={{ border: 0 }}
              ></iframe>
            </div>
          )}
          
          {detectedPreciseLocation && (
            <Card className="p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Precise Location Details
              </h3>
              <div className="space-y-1 text-sm">
                {streetName && <p><strong>Street:</strong> {streetName}</p>}
                {cityName && <p><strong>City/Town:</strong> {cityName}</p>}
                {stateName && <p><strong>State:</strong> {stateName}</p>}
                {fullAddress && (
                  <div className="pt-2 border-t mt-2">
                    <p><strong>Full Address:</strong> {fullAddress}</p>
                  </div>
                )}
              </div>
            </Card>
          )}
          
          <div className="text-sm text-muted-foreground">
            <p>Data © OpenStreetMap contributors, available under the Open Database License.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
