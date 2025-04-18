
import { useLocation } from "@/providers/LocationProvider";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LocationHeader() {
  const { currentLocation, setShowLocationPicker } = useLocation();
  const { requestGeolocation, loading } = useGeolocation();
  const navigate = useNavigate();

  if (!currentLocation || currentLocation === "All India") {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent dark:from-primary/5 dark:via-primary/2 dark:to-transparent backdrop-blur-sm rounded-lg p-4 mb-6 animate-fade-in border border-primary/10">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-primary/80">
            <MapPin className="h-5 w-5" />
            <h2 className="font-medium text-sm">You're browsing from</h2>
          </div>
          <p className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {currentLocation}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowLocationPicker(true)}
            className="hidden sm:flex items-center gap-2 hover:bg-primary/5"
          >
            <MapPin className="h-4 w-4" />
            Change
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => navigate("/maps")}
            className="hidden sm:flex items-center gap-2"
          >
            <Map className="h-4 w-4" />
            View Map
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => requestGeolocation()}
            disabled={loading}
            className="animate-in slide-in-from-right"
          >
            <Navigation className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Detect Location</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
