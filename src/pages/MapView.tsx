import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, MapPin, Navigation, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "@/providers/LocationProvider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGeolocation } from "@/hooks/useGeolocation";
import { toast } from "sonner";
import { getAccurateAddress, isZructuresAvailable, showLocationAccessPrompt } from "@/utils/locationUtils";

const MapView = () => {
  const navigate = useNavigate();
  const { currentLocation, setCurrentLocation } = useLocation();
  const { 
    position, 
    loading, 
    requestGeolocation,
    streetName,
    cityName,
    stateName,
    fullAddress,
    neighborhood
  } = useGeolocation();
  
  const [isLoading, setIsLoading] = useState(true);
  const [detectedPreciseLocation, setDetectedPreciseLocation] = useState<string | null>(null);
  const [accuracyLevel, setAccuracyLevel] = useState<string | null>(null);
  
  // Handle initial loading and location detection
  useEffect(() => {
    let timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    // Try to show first-time location access prompt
    const checkFirstTimePrompt = async () => {
      const shouldRequestLocation = await showLocationAccessPrompt();
      if (shouldRequestLocation) {
        requestGeolocation();
      }
    };
    
    checkFirstTimePrompt();
    
    // If we already have position data, try to show precise location
    if (position) {
      setIsLoading(false);
      clearTimeout(timeout);
      
      // Get accuracy level description
      if (position.accuracy) {
        if (position.accuracy <= 10) {
          setAccuracyLevel("Excellent (GPS)");
        } else if (position.accuracy <= 50) {
          setAccuracyLevel("Good");
        } else if (position.accuracy <= 500) {
          setAccuracyLevel("Approximate");
        } else {
          setAccuracyLevel("Low");
        }
      }
    }
    
    return () => clearTimeout(timeout);
  }, [position, requestGeolocation]);

  // Update detected location when geolocation hook data changes
  useEffect(() => {
    const updatePreciseLocation = async () => {
      if (position) {
        try {
          // Check if we're within Tadipatri area by coordinates
          const isTadipatriArea = 
            position.latitude >= 14.89 && position.latitude <= 14.95 && 
            position.longitude >= 77.96 && position.longitude <= 78.03;
          
          // Try to get the most accurate address possible
          const accurateAddress = await getAccurateAddress(position.latitude, position.longitude);
          
          // If we're in Tadipatri area by coordinates but address doesn't mention it, append it
          if (isTadipatriArea && !accurateAddress.toLowerCase().includes('tadipatri')) {
            const formattedAddress = `${accurateAddress}, Tadipatri`;
            setDetectedPreciseLocation(formattedAddress);
          } else {
            setDetectedPreciseLocation(accurateAddress);
          }
          
          // If we have neighborhood, street and city from the hook
          if (neighborhood && streetName && cityName) {
            const formattedAddress = `${neighborhood}, ${streetName}, ${cityName}`;
            
            // Only update if we don't already have a more detailed address
            if (!detectedPreciseLocation || detectedPreciseLocation.length < formattedAddress.length) {
              setDetectedPreciseLocation(formattedAddress);
            }
          } else if (fullAddress) {
            setDetectedPreciseLocation(fullAddress);
          }
        } catch (error) {
          console.error("Error getting accurate address:", error);
        }
      }
    };
    
    updatePreciseLocation();
  }, [position, streetName, cityName, fullAddress, neighborhood]);

  // Format coordinates for display
  const formatCoordinate = (coord: number): string => {
    return coord.toFixed(6);
  };

  // Handle detect location button click
  const handleDetectLocation = () => {
    setIsLoading(true);
    setDetectedPreciseLocation(null); // Reset previous detection
    requestGeolocation();
    toast.success("Detecting your precise location...");
  };

  // Update user's current location
  const handleUseThisLocation = () => {
    if (detectedPreciseLocation) {
      // If the location contains Tadipatri, ensure availability is true
      if (detectedPreciseLocation.toLowerCase().includes('tadipatri') ||
          (position && position.latitude >= 14.89 && position.latitude <= 14.95 && 
           position.longitude >= 77.96 && position.longitude <= 78.03)) {
        
        // Ensure Tadipatri is in the location string
        let updatedLocation = detectedPreciseLocation;
        if (!updatedLocation.toLowerCase().includes('tadipatri')) {
          updatedLocation = `${updatedLocation}, Tadipatri`;
        }
        
        setCurrentLocation(updatedLocation);
        toast.success("Location updated to Tadipatri area");
      } else {
        setCurrentLocation(detectedPreciseLocation);
        toast.success("Location updated successfully!");
        
        // Check if this location is available
        const isAvailable = isZructuresAvailable(detectedPreciseLocation);
        if (!isAvailable) {
          toast.info("Note: Zructures is not yet fully available in this location. Some features may be limited.");
        }
      }
      
      // Navigate back or to home
      setTimeout(() => navigate(-1), 1000);
    }
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
                  {position.accuracy && (
                    <span className="ml-1">
                      (Accuracy: ±{Math.round(position.accuracy)}m)
                    </span>
                  )}
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

              {detectedPreciseLocation && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleUseThisLocation}
                  className="flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Use This Location
                </Button>
              )}
            </div>
          </div>

          {isLoading || loading ? (
            <Card className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p>Loading map and detecting precise location...</p>
                <p className="text-sm text-muted-foreground">This may take a few moments for greater accuracy</p>
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
              <h3 className="font-medium mb-2 flex items-center">
                <MapPin className="h-5 w-5 text-primary" />
                Precise Location Details
              </h3>
              <div className="space-y-1 text-sm">
                {neighborhood && <p><strong>Neighborhood/Colony:</strong> {neighborhood}</p>}
                {streetName && <p><strong>Street:</strong> {streetName}</p>}
                {cityName && <p><strong>City/Town:</strong> {cityName}</p>}
                {stateName && <p><strong>State:</strong> {stateName}</p>}
                {fullAddress && (
                  <div className="pt-2 border-t mt-2">
                    <p><strong>Full Address:</strong> {fullAddress}</p>
                  </div>
                )}
                
                {position?.accuracy && (
                  <div className="flex items-center gap-2 pt-2 border-t mt-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    <p>
                      <strong>GPS Accuracy:</strong> ±{Math.round(position.accuracy)}m 
                      {accuracyLevel && <span> ({accuracyLevel})</span>}
                    </p>
                  </div>
                )}
                
                <div className="pt-3 mt-2">
                  <Button 
                    onClick={handleUseThisLocation}
                    className="w-full"
                    variant="default"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Use This Location
                  </Button>
                </div>
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
