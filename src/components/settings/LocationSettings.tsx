
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, MapPin, Radio, Locate, Map as MapIcon, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { EnhancedLocationSelector } from "@/components/location/EnhancedLocationSelector";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LocationSettings() {
  const [selectedLocation, setSelectedLocation] = useState(localStorage.getItem('userLocation') || "All India");
  const [visibleRadius, setVisibleRadius] = useState(Number(localStorage.getItem('userVisibleRadius') || "10"));
  const [autoUpdateLocation, setAutoUpdateLocation] = useState(localStorage.getItem('autoUpdateLocation') === 'true');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const { requestGeolocation, loading, address } = useGeolocation();
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt" | "unknown">("unknown");

  useEffect(() => {
    // Check location permission status
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

  const handleSaveLocation = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('userLocation', selectedLocation);
      localStorage.setItem('userVisibleRadius', visibleRadius.toString());
      localStorage.setItem('autoUpdateLocation', autoUpdateLocation.toString());
      
      toast.success("Location preferences saved successfully");
      setSaving(false);
      
      // Dispatch a custom event that other components can listen for
      window.dispatchEvent(new CustomEvent('locationUpdated', { 
        detail: { 
          location: selectedLocation, 
          visibleRadius,
          autoUpdateLocation
        } 
      }));
    }, 500);
  };

  const handleDetectLocation = () => {
    requestGeolocation();
  };

  const getPermissionMessage = () => {
    switch (locationPermission) {
      case "granted":
        return "Location access is enabled";
      case "denied":
        return "Location access is blocked. Please update your browser settings to enable location access.";
      case "prompt":
        return "Click 'Detect my location' to allow location access";
      default:
        return "Location permission status unknown";
    }
  };

  const getPermissionClass = () => {
    switch (locationPermission) {
      case "granted":
        return "text-green-500";
      case "denied":
        return "text-red-500";
      case "prompt":
        return "text-amber-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
          <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Location Settings</CardTitle>
              <CardDescription>
                Set your preferred location to see relevant content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className={`text-sm ${getPermissionClass()} flex items-center gap-2`}>
                  {locationPermission === "granted" ? 
                    <Radio className="h-4 w-4" /> : 
                    locationPermission === "denied" ? 
                      <MapPin className="h-4 w-4" /> : 
                      <Locate className="h-4 w-4" />}
                  {getPermissionMessage()}
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-medium">Your Location</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Choose your location to see relevant businesses and services
                  </p>
                  
                  <EnhancedLocationSelector 
                    value={selectedLocation}
                    onChange={setSelectedLocation}
                    className="w-full"
                    showDetect={true}
                  />
                </div>
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
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Location Settings</CardTitle>
              <CardDescription>
                Configure how location affects your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-base font-medium">Content Radius</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Set how far you want to see content from
                </p>
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setVisibleRadius(Math.max(1, visibleRadius - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Slider
                    value={[visibleRadius]}
                    min={1}
                    max={50}
                    step={1}
                    onValueChange={(values) => setVisibleRadius(values[0])}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setVisibleRadius(Math.min(50, visibleRadius + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <span className="w-16 text-center font-medium">
                    {visibleRadius} km
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-update"
                  checked={autoUpdateLocation}
                  onCheckedChange={setAutoUpdateLocation}
                />
                <Label htmlFor="auto-update">Auto-update location when I move</Label>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-medium">Default View</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Choose how you want to see location-based content
                </p>
                <Select defaultValue="hybrid">
                  <SelectTrigger>
                    <SelectValue placeholder="Select view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="list">List View</SelectItem>
                    <SelectItem value="map">Map View</SelectItem>
                    <SelectItem value="hybrid">Hybrid View</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full mt-4" 
                onClick={handleSaveLocation} 
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Advanced Settings"}
                <Save className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
