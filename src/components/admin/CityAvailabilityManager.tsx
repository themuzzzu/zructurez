
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { City } from "@/utils/cityAvailabilityUtils";

export function CityAvailabilityManager() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Load all cities data
  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from("city_availability")
          .select("*")
          .order("district")
          .order("city_name");
        
        if (error) throw error;
        
        setCities(data || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast.error("Failed to load cities data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCities();
  }, []);
  
  // Filter cities based on search and active tab
  const filteredCities = cities.filter(city => {
    const matchesSearch = city.city_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          city.district.toLowerCase().includes(searchQuery.toLowerCase());
                          
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "available") return matchesSearch && city.is_available;
    if (activeTab === "unavailable") return matchesSearch && !city.is_available;
    
    return matchesSearch;
  });
  
  // Group cities by district
  const citiesByDistrict = filteredCities.reduce((acc: Record<string, City[]>, city) => {
    if (!acc[city.district]) {
      acc[city.district] = [];
    }
    acc[city.district].push(city);
    return acc;
  }, {});
  
  // Toggle city availability
  const toggleCityAvailability = async (cityId: number, newStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("city_availability")
        .update({ is_available: newStatus })
        .eq("id", cityId);
        
      if (error) throw error;
      
      // Update local state
      setCities(cities.map(city => 
        city.id === cityId ? { ...city, is_available: newStatus } : city
      ));
      
      toast.success(`${newStatus ? "Enabled" : "Disabled"} city successfully`);
    } catch (error) {
      console.error("Error updating city availability:", error);
      toast.error("Failed to update city availability");
    }
  };
  
  // Stats for the dashboard
  const totalCities = cities.length;
  const availableCities = cities.filter(city => city.is_available).length;
  const unavailableCities = totalCities - availableCities;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage City Availability</CardTitle>
        <CardDescription>
          Enable or disable cities for Zructures availability
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{totalCities}</div>
                <p className="text-xs text-muted-foreground">Total Cities</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">{availableCities}</div>
                <p className="text-xs text-muted-foreground">Available Cities</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-amber-600">{unavailableCities}</div>
                <p className="text-xs text-muted-foreground">Coming Soon Cities</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <Input
                placeholder="Search cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="w-full md:w-1/2">
              <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="available">Available</TabsTrigger>
                  <TabsTrigger value="unavailable">Coming Soon</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="border rounded-md">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredCities.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                No cities found matching your search
              </div>
            ) : (
              <div className="max-h-[600px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>City Name</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Toggle</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(citiesByDistrict).map(([district, districtCities]) => (
                      <>
                        <TableRow key={district} className="bg-muted/50">
                          <TableCell colSpan={4} className="font-medium">
                            {district} District
                          </TableCell>
                        </TableRow>
                        
                        {districtCities.map((city) => (
                          <TableRow key={city.id}>
                            <TableCell>{city.city_name}</TableCell>
                            <TableCell>{city.district}</TableCell>
                            <TableCell>
                              <Badge variant={city.is_available ? "success" : "warning"}>
                                {city.is_available ? "Available" : "Coming Soon"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Switch
                                checked={city.is_available}
                                onCheckedChange={(checked) => toggleCityAvailability(city.id, checked)}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Only available cities will be fully functional in Zructures
        </p>
      </CardFooter>
    </Card>
  );
}
