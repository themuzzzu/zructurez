
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "@/providers/LocationProvider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to update map view when coordinates change
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  
  return null;
};

// Component to detect city using Nominatim API
const CityDetector = ({ 
  lat, 
  lng, 
  onCityDetected 
}: { 
  lat: number; 
  lng: number; 
  onCityDetected: (city: string) => void 
}) => {
  useEffect(() => {
    const getUserCity = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        const city = data.address?.city || data.address?.town || data.address?.village || null;
        
        if (city) {
          onCityDetected(city);
        }
      } catch (error) {
        console.error("Error detecting city:", error);
      }
    };
    
    getUserCity();
  }, [lat, lng, onCityDetected]);
  
  return null;
};

const MapView = () => {
  const navigate = useNavigate();
  const { latitude, longitude, currentLocation } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [center, setCenter] = useState<[number, number]>([14.904093, 77.981401]); // Default to Tadipatri
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  
  useEffect(() => {
    if (latitude && longitude) {
      setCenter([latitude, longitude]);
    }
    setIsLoading(false);
  }, [latitude, longitude]);
  
  const handleCityDetected = (city: string) => {
    setDetectedCity(city);
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
              <MapContainer 
                center={center} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center}>
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-medium">Your location</h3>
                      <p className="text-sm">{detectedCity || currentLocation || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Lat: {center[0].toFixed(6)}, Lng: {center[1].toFixed(6)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
                <MapUpdater center={center} />
                <CityDetector 
                  lat={center[0]} 
                  lng={center[1]} 
                  onCityDetected={handleCityDetected}
                />
              </MapContainer>
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
