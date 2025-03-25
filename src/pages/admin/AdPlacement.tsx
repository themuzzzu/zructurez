
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Plus, ChartBar, Image, Video } from "lucide-react";
import { toast } from "sonner";

interface AdPlacement {
  id: string;
  name: string;
  type: "banner" | "sponsored" | "recommendation" | "sidebar";
  location: string;
  cpm_rate: number;
  cpc_rate: number;
  active: boolean;
  impressions: number;
  clicks: number;
  revenue: number;
}

const AdPlacement = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newPlacementName, setNewPlacementName] = useState("");
  const [newPlacementType, setNewPlacementType] = useState<string>("banner");
  const [newPlacementLocation, setNewPlacementLocation] = useState<string>("homepage");
  
  // Fetch ad placements
  const { data: placements = [], isLoading, refetch } = useQuery({
    queryKey: ['ad-placements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ad_placements')
        .select('*')
        .order('name');
      
      if (error) {
        toast.error("Failed to load ad placements");
        throw error;
      }
      
      return data as AdPlacement[] || [];
    }
  });
  
  // Create new placement
  const handleCreatePlacement = async () => {
    if (!newPlacementName || !newPlacementType || !newPlacementLocation) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      const { error } = await supabase.from('ad_placements').insert({
        name: newPlacementName,
        type: newPlacementType,
        location: newPlacementLocation,
        cpm_rate: newPlacementType === 'banner' ? 30 : 15,
        cpc_rate: newPlacementType === 'sponsored' ? 2.5 : 1.0,
        active: true
      });
      
      if (error) throw error;
      
      toast.success("Ad placement created successfully");
      setNewPlacementName("");
      refetch();
    } catch (error) {
      console.error('Error creating ad placement:', error);
      toast.error("Failed to create ad placement");
    }
  };
  
  // Toggle placement status
  const togglePlacementStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('ad_placements')
        .update({ active: !currentStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success(`Placement ${currentStatus ? 'disabled' : 'enabled'} successfully`);
      refetch();
    } catch (error) {
      console.error('Error toggling placement status:', error);
      toast.error("Failed to update placement status");
    }
  };
  
  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
    toast.success("Placement data refreshed");
  };
  
  // Calculate stats
  const totalRevenue = placements.reduce((sum, p) => sum + (p.revenue || 0), 0);
  const totalImpressions = placements.reduce((sum, p) => sum + (p.impressions || 0), 0);
  const totalClicks = placements.reduce((sum, p) => sum + (p.clicks || 0), 0);
  const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) : "0";
  
  return (
    <div className="container py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Ad Placement Manager</h1>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            <p className="text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalImpressions.toLocaleString('en-IN')}</div>
            <p className="text-muted-foreground">Total Impressions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalClicks.toLocaleString('en-IN')}</div>
            <p className="text-muted-foreground">Total Clicks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{averageCTR}%</div>
            <p className="text-muted-foreground">Average CTR</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Ad Placements</CardTitle>
            <CardDescription>Manage ad placements across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>CPM Rate</TableHead>
                  <TableHead>CPC Rate</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Loading placements...
                    </TableCell>
                  </TableRow>
                ) : placements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No ad placements found
                    </TableCell>
                  </TableRow>
                ) : (
                  placements.map((placement) => {
                    const ctr = placement.impressions > 0 
                      ? (placement.clicks / placement.impressions * 100).toFixed(2) 
                      : "0";
                      
                    return (
                      <TableRow key={placement.id}>
                        <TableCell className="font-medium">{placement.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {placement.type === 'banner' && <Image className="h-3 w-3 mr-1" />}
                            {placement.type === 'sponsored' && <ChartBar className="h-3 w-3 mr-1" />}
                            {placement.type === 'recommendation' && <Video className="h-3 w-3 mr-1" />}
                            {placement.type.charAt(0).toUpperCase() + placement.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{placement.location}</TableCell>
                        <TableCell>₹{placement.cpm_rate}</TableCell>
                        <TableCell>₹{placement.cpc_rate}</TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div>CTR: {ctr}%</div>
                            <div>Impr: {placement.impressions?.toLocaleString('en-IN') || 0}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Switch 
                            checked={placement.active} 
                            onCheckedChange={() => togglePlacementStatus(placement.id, placement.active)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Create New Placement</CardTitle>
            <CardDescription>Add a new advertisement placement</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="placement-name">Placement Name</Label>
                <Input 
                  id="placement-name"
                  value={newPlacementName} 
                  onChange={(e) => setNewPlacementName(e.target.value)}
                  placeholder="e.g., Homepage Top Banner"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="placement-type">Placement Type</Label>
                <Select 
                  value={newPlacementType} 
                  onValueChange={setNewPlacementType}
                >
                  <SelectTrigger id="placement-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banner">Banner Ad</SelectItem>
                    <SelectItem value="sponsored">Sponsored Listing</SelectItem>
                    <SelectItem value="recommendation">Recommendation Ad</SelectItem>
                    <SelectItem value="sidebar">Sidebar Ad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="placement-location">Location</Label>
                <Select 
                  value={newPlacementLocation} 
                  onValueChange={setNewPlacementLocation}
                >
                  <SelectTrigger id="placement-location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homepage">Homepage</SelectItem>
                    <SelectItem value="marketplace">Marketplace</SelectItem>
                    <SelectItem value="search">Search Results</SelectItem>
                    <SelectItem value="product-detail">Product Detail</SelectItem>
                    <SelectItem value="category">Category Pages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <Button
                type="button"
                onClick={handleCreatePlacement}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Placement
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdPlacement;
