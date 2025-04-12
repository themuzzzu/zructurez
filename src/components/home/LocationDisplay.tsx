
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Locate, Navigation, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGeolocation } from "@/hooks/useGeolocation";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LocationDisplayProps {
  className?: string;
}

export function LocationDisplay({ className = "" }: LocationDisplayProps) {
  const [location, setLocation] = useState(localStorage.getItem('userLocation') || "All India");
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt" | "unknown">("unknown");
  const [visibleRadius, setVisibleRadius] = useState(Number(localStorage.getItem('userVisibleRadius') || "10"));
  const navigate = useNavigate();
  const { requestGeolocation, loading, position } = useGeolocation();

  // Check if we've shown the location prompt before
  useEffect(() => {
    const hasShownPrompt = localStorage.getItem('locationPromptShown');
    const hasLocation = localStorage.getItem('userPreciseLocation');
    
    if (!hasShownPrompt && !hasLocation) {
      // Wait a bit before showing the prompt
      const timer = setTimeout(() => {
        setShowLocationPrompt(true);
        localStorage.setItem('locationPromptShown', 'true');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Check location permission
    const checkPermission = async () => {
      if (!("permissions" in navigator)) return;
      
      try {
        const permission = await navigator.permissions.query({ name: "geolocation" as PermissionName });
        setLocationPermission(permission.state as "granted" | "denied" | "prompt");
        
        permission.onchange = function() {
          setLocationPermission(this.state as "granted" | "denied" | "prompt");
        };
      } catch (error) {
        console.error("Error checking geolocation permission:", error);
      }
    };
    
    checkPermission();
  }, []);
  
  useEffect(() => {
    const handleLocationUpdated = (event: CustomEvent) => {
      if (event.detail.location) {
        setLocation(event.detail.location);
      }
      
      if (event.detail.visibleRadius) {
        setVisibleRadius(event.detail.visibleRadius);
      }
    };

    window.addEventListener('locationUpdated', handleLocationUpdated as EventListener);
    
    return () => {
      window.removeEventListener('locationUpdated', handleLocationUpdated as EventListener);
    };
  }, []);

  const handleDetectLocation = () => {
    requestGeolocation();
    setShowLocationPrompt(false);
  };

  return (
    <>
      <Card className={`${className} border border-dashed animate-fade-in overflow-hidden transition-all hover:shadow-md`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-medium">You're browsing from</h3>
            </div>
            {locationPermission !== "granted" && (
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
            )}
          </div>
          
          <div className="mt-1 mb-2">
            <p className="font-semibold text-lg flex items-center">
              {location}
              {position && (
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  ({visibleRadius} km radius)
                </span>
              )}
            </p>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            We're showing you businesses and services near your location.
          </p>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => navigate("/settings?tab=location")}
            >
              Change Location
            </Button>
            
            {locationPermission === "granted" && (
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={handleDetectLocation}
                disabled={loading}
              >
                {loading ? (
                  <Locate className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <Navigation className="h-4 w-4 mr-1" />
                )}
                Update
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showLocationPrompt} onOpenChange={setShowLocationPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Enable location for better experience</AlertDialogTitle>
            <AlertDialogDescription>
              Hey! We'd love to show you what's happening around you. Can we use your location to personalize your experience?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Not now</AlertDialogCancel>
            <AlertDialogAction onClick={handleDetectLocation}>
              Yes, enable location
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
