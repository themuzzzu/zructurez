
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "@/providers/LocationProvider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MapView = () => {
  const navigate = useNavigate();
  const { latitude, longitude, currentLocation } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  
  useEffect(() => {
    const getUserCity = async () => {
      try {
        if (latitude && longitude) {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const city = data.address?.city || data.address?.town || data.address?.village || null;
          
          if (city) {
            setDetectedCity(city);
          }
        }
        
        // Always set loading to false after 1.5 seconds to prevent infinite loading
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error detecting city:", error);
        setIsLoading(false);
      }
    };
    
    getUserCity();
  }, [latitude, longitude]);
  
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
                {currentLocation || detectedCity || "Local Area Map"}
              </h1>
              <p className="text-muted-foreground">
                {detectedCity ? `Detected: ${detectedCity}` : "Explore your local area"}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-2 py-1">
                Using OpenStreetMap
              </Badge>
            </div>
          </div>

          {isLoading ? (
            <Card className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p>Loading map...</p>
              </div>
            </Card>
          ) : (
            <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg animate-fade-up">
              <iframe 
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude ? (longitude - 0.02) : 77.96}%2C${latitude ? (latitude - 0.02) : 14.88}%2C${longitude ? (longitude + 0.02) : 78.00}%2C${latitude ? (latitude + 0.02) : 14.92}&layer=mapnik&marker=${latitude || 14.904093}%2C${longitude || 77.981401}`}
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
          
          <div className="text-sm text-muted-foreground">
            <p>Data © OpenStreetMap contributors, available under the Open Database License.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
