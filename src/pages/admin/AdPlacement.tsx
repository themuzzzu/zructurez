
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client"; 
import { AdPlacement } from "@/services/adService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdPlacementPage = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPlacement, setNewPlacement] = useState({
    name: "",
    description: "",
    type: "",
    location: "",
    cpm_rate: 10,
    cpc_rate: 1,
    size: "",
    max_size_kb: 1024,
    priority: 1,
    active: true
  });
  
  const { data: placements = [], isLoading, refetch } = useQuery({
    queryKey: ['ad-placements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ad_placements')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        toast.error("Failed to load ad placements");
        throw error;
      }
      
      return data.map(placement => ({
        ...placement,
        impressions: 0,
        clicks: 0,
        revenue: 0
      })) as AdPlacement[];
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setNewPlacement(prev => ({
        ...prev,
        [name]: parseFloat(value)
      }));
    } else {
      setNewPlacement(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setNewPlacement(prev => ({
      ...prev,
      active: checked
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const placementData = {
        ...newPlacement,
        location: newPlacement.location,
        name: newPlacement.name,
        type: newPlacement.type
      };
      
      const { data, error } = await supabase
        .from('ad_placements')
        .insert([placementData])
        .select();
        
      if (error) throw error;
      
      toast.success("Ad placement created successfully");
      setIsCreateDialogOpen(false);
      refetch();
      
      // Reset form
      setNewPlacement({
        name: "",
        description: "",
        type: "",
        location: "",
        cpm_rate: 10,
        cpc_rate: 1,
        size: "",
        max_size_kb: 1024,
        priority: 1,
        active: true
      });
    } catch (error: any) {
      toast.error(`Failed to create ad placement: ${error.message}`);
    }
  };
  
  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('ad_placements')
        .update({ active: !currentActive })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success(`Ad placement ${currentActive ? 'deactivated' : 'activated'}`);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to update ad placement: ${error.message}`);
    }
  };
  
  return (
    <div className="container py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Ad Placement Management</h1>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Placement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Ad Placement</DialogTitle>
              <DialogDescription>
                Define where and how ads will appear on your platform
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    placeholder="Homepage Banner"
                    value={newPlacement.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Input 
                    id="type"
                    name="type"
                    placeholder="banner, sidebar, popup"
                    value={newPlacement.type}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location"
                  name="location"
                  placeholder="homepage, product page, category listing"
                  value={newPlacement.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description"
                  name="description"
                  placeholder="Prominent banner at the top of homepage"
                  value={newPlacement.description}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpm_rate">CPM Rate (₹)</Label>
                  <Input 
                    id="cpm_rate"
                    name="cpm_rate"
                    type="number"
                    min="1"
                    step="0.01"
                    value={newPlacement.cpm_rate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cpc_rate">CPC Rate (₹)</Label>
                  <Input 
                    id="cpc_rate"
                    name="cpc_rate"
                    type="number"
                    min="0.1"
                    step="0.01"
                    value={newPlacement.cpc_rate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Input 
                    id="size"
                    name="size"
                    placeholder="300x250, 728x90"
                    value={newPlacement.size}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max_size_kb">Max Size (KB)</Label>
                  <Input 
                    id="max_size_kb"
                    name="max_size_kb"
                    type="number"
                    min="1"
                    value={newPlacement.max_size_kb}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Input 
                    id="priority"
                    name="priority"
                    type="number"
                    min="1"
                    max="10"
                    value={newPlacement.priority}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="flex items-center justify-end h-full">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="active"
                      checked={newPlacement.active}
                      onCheckedChange={handleSwitchChange}
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>
                </div>
              </div>
              
              <Button type="submit" className="w-full">Create Placement</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Ad Placements</CardTitle>
          <CardDescription>Manage where ads appear across your platform</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Loading ad placements...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>CPM/CPC Rates</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {placements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No ad placements found. Create your first placement.
                    </TableCell>
                  </TableRow>
                ) : (
                  placements.map((placement) => (
                    <TableRow key={placement.id}>
                      <TableCell className="font-medium">{placement.name}</TableCell>
                      <TableCell>{placement.type}</TableCell>
                      <TableCell>{placement.location}</TableCell>
                      <TableCell>₹{placement.cpm_rate} CPM<br/>₹{placement.cpc_rate} CPC</TableCell>
                      <TableCell>{placement.size || "N/A"}</TableCell>
                      <TableCell>{placement.priority}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${placement.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {placement.active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleActive(placement.id, placement.active)}
                          >
                            {placement.active ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {placements.reduce((sum, placement) => sum + (placement.impressions || 0), 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {placements.reduce((sum, placement) => sum + (placement.clicks || 0), 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ₹{placements.reduce((sum, placement) => sum + (placement.revenue || 0), 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdPlacementPage;
