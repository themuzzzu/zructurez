
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, MapPin } from "lucide-react";
import { toast } from "sonner";
import { LocationSelector } from "@/components/LocationSelector";
import { MapLocationSelector } from "@/components/create-service/MapLocationSelector";

export function LocationSettings() {
  const [selectedLocation, setSelectedLocation] = useState(localStorage.getItem('userLocation') || "All India");
  const [preciseLocation, setPreciseLocation] = useState(localStorage.getItem('userPreciseLocation') || "");
  const [saving, setSaving] = useState(false);

  const handleSaveLocation = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('userLocation', selectedLocation);
      localStorage.setItem('userPreciseLocation', preciseLocation);
      
      toast.success("Location preferences saved successfully");
      setSaving(false);
      
      // Dispatch a custom event that other components can listen for
      window.dispatchEvent(new CustomEvent('locationUpdated', { 
        detail: { location: selectedLocation, preciseLocation } 
      }));
    }, 500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Location Settings</CardTitle>
          <CardDescription>
            Set your preferred location to see relevant content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-base font-medium">Select Region</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Choose your general location to see relevant businesses and services
            </p>
            <LocationSelector 
              value={selectedLocation}
              onChange={setSelectedLocation}
              className="w-full max-w-md"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-medium">Precise Location</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Set a more precise location for better recommendations
            </p>
            <MapLocationSelector
              value={preciseLocation}
              onChange={setPreciseLocation}
            />
          </div>
          
          <Button 
            className="w-full mt-4" 
            onClick={handleSaveLocation} 
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Location Preferences"}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
