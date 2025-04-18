
import { useLocation } from "@/providers/LocationProvider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

interface LocationAvailabilityStatusProps {
  className?: string;
}

export function LocationAvailabilityStatus({ className }: LocationAvailabilityStatusProps) {
  const { currentLocation, isLocationAvailable } = useLocation();
  
  if (!currentLocation || currentLocation === "All India") {
    return null;
  }

  return isLocationAvailable ? (
    <Alert variant="default" className={`border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900 ${className}`}>
      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      <AlertTitle className="text-green-800 dark:text-green-300">Available in {currentLocation}</AlertTitle>
      <AlertDescription className="text-green-700 dark:text-green-400">
        Zructures services are fully available in your area
      </AlertDescription>
    </Alert>
  ) : (
    <Alert variant="default" className={`border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-900 ${className}`}>
      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-800 dark:text-amber-300">Not Available in {currentLocation}</AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-400">
        Zructures is not yet available in this area. Please select a different location.
      </AlertDescription>
    </Alert>
  );
}
