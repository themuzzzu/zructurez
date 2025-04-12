
import { useLocation } from "@/providers/LocationProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertTriangle } from "lucide-react";

interface LocationAvailabilityStatusProps {
  className?: string;
  compact?: boolean;
}

export function LocationAvailabilityStatus({ 
  className = "", 
  compact = false 
}: LocationAvailabilityStatusProps) {
  const { currentLocation, isLocationAvailable, setShowLocationPicker } = useLocation();
  
  if (currentLocation === "All India") {
    return null;
  }
  
  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge variant={isLocationAvailable ? "success" : "warning"} className="h-2 w-2 rounded-full p-0" />
        <span className="text-sm">
          {isLocationAvailable 
            ? `Available in ${currentLocation}` 
            : `Coming soon to ${currentLocation}`}
        </span>
      </div>
    );
  }

  return (
    <Card className={`${className} overflow-hidden animate-fade-in`}>
      <CardContent className="p-4">
        <div className={`flex items-center gap-3 ${
          isLocationAvailable 
            ? "text-green-700 dark:text-green-500" 
            : "text-amber-700 dark:text-amber-500"
        }`}>
          {isLocationAvailable ? (
            <MapPin className="h-5 w-5 shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 shrink-0" />
          )}
          <div>
            <h3 className="font-medium">
              {isLocationAvailable ? "Zructures is available!" : "Not yet available"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isLocationAvailable
                ? `We're actively serving ${currentLocation} and nearby areas.`
                : `We're not serving ${currentLocation} yet, but we're expanding fast!`}
            </p>
          </div>
        </div>

        {!isLocationAvailable && (
          <div className="mt-3 flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowLocationPicker(true)}
            >
              Change Location
            </Button>
            <p className="text-xs text-muted-foreground">Browse in limited mode</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
