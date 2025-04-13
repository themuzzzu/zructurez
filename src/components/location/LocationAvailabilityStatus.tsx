
import { useLocation } from "@/providers/LocationProvider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LocationAvailabilityStatusProps {
  className?: string;
}

export function LocationAvailabilityStatus({ className }: LocationAvailabilityStatusProps) {
  const { currentLocation, isLocationAvailable, setShowLocationPicker } = useLocation();
  const navigate = useNavigate();

  if (!currentLocation || currentLocation === "All India") {
    return null;
  }

  return (
    <div className={className}>
      {isLocationAvailable ? (
        <Alert variant="default" className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-300">Available in {currentLocation}</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">
            Zructures services are fully available in your area. Enjoy browsing local businesses and services!
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="default" className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-900">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-300">Limited Availability in {currentLocation}</AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-2 text-amber-700 dark:text-amber-400">
            <span className="flex-grow">Zructures is not fully available in this area yet. Some features may be limited.</span>
            <div className="flex gap-2 mt-2 sm:mt-0">
              <Button size="sm" variant="outline" onClick={() => setShowLocationPicker(true)}>
                Change Location
              </Button>
              <Button size="sm" onClick={() => navigate("/maps")}>
                <Map className="h-3.5 w-3.5 mr-1" />
                View Map
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
