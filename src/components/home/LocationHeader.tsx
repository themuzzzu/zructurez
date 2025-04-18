
import { useLocation } from "@/providers/LocationProvider";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LocationHeader() {
  const { currentLocation, setShowLocationPicker } = useLocation();
  const { requestGeolocation, loading } = useGeolocation();
  const navigate = useNavigate();

  if (!currentLocation || currentLocation === "All India") {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="font-medium text-lg">You're browsing from</h2>
          </div>
          <p className="text-2xl font-semibold text-foreground">{currentLocation}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowLocationPicker(true)}
            className="hidden sm:flex"
          >
            Change Location
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => navigate("/maps")}
            className="hidden sm:flex"
          >
            View Map
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => requestGeolocation()}
            disabled={loading}
          >
            <Navigation className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Detect Location</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
