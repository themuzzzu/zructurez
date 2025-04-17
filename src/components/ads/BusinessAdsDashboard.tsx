
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableHeader, Table, TableBody, TableCell, TableRow, TableHead } from "@/components/ui/table";
import { 
  BarChart, // Import BarChart from lucide-react instead of Bar
  LineChart, 
  MoreHorizontal,
  Eye, 
  MousePointer, 
  TrendingUp
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Advertisement } from "@/types/advertisement";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

interface BusinessAdsDashboardProps {
  businessId?: string;
}

export const BusinessAdsDashboard = ({ businessId }: BusinessAdsDashboardProps) => {
  const [activeTab, setActiveTab] = useState("active");

  // Fetch ads for the business
  const { data: advertisements, isLoading, error, refetch } = useQuery({
    queryKey: ["business-ads", businessId, activeTab],
    queryFn: async () => {
      if (!businessId) return [];
      
      let query = supabase
        .from("advertisements")
        .select("*")
        .eq("business_id", businessId);
        
      if (activeTab === "active") {
        query = query
          .eq("status", "active")
          .gte("end_date", new Date().toISOString());
      } else if (activeTab === "scheduled") {
        query = query
          .eq("status", "scheduled")
          .gt("start_date", new Date().toISOString());
      } else if (activeTab === "completed") {
        query = query
          .or(`status.eq.completed,end_date.lt.${new Date().toISOString()}`);
      } else if (activeTab === "draft") {
        query = query.eq("status", "draft");
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!businessId,
  });

  // Handle status change
  const handleStatusChange = async (adId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("advertisements")
        .update({ status: newStatus })
        .eq("id", adId);
        
      if (error) throw error;
      
      toast.success(`Ad ${newStatus === "active" ? "activated" : "paused"} successfully`);
      refetch();
    } catch (error) {
      console.error("Error updating ad status:", error);
      toast.error("Failed to update ad status");
    }
  };

  // Get badge color based on ad status
  const getStatusBadge = (ad: Advertisement) => {
    const currentDate = new Date();
    const endDate = new Date(ad.end_date);
    
    if (ad.status === "draft") return <Badge variant="outline">Draft</Badge>;
    if (ad.status === "scheduled") return <Badge variant="secondary">Scheduled</Badge>;
    if (ad.status === "completed" || endDate < currentDate) 
      return <Badge variant="outline">Completed</Badge>;
    if (ad.status === "active") return <Badge variant="success">Active</Badge>;
    if (ad.status === "paused") return <Badge variant="warning">Paused</Badge>;
    
    return <Badge variant="outline">{ad.status}</Badge>;
  };

  // Check if there's an error
  if (error) {
    console.error("Error fetching ads:", error);
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Error loading advertisements</p>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0 pt-0">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : advertisements && advertisements.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ad</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {advertisements.map((ad) => (
                      <TableRow key={ad.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {ad.image_url && (
                              <img
                                src={ad.image_url}
                                alt={ad.title}
                                className="h-10 w-10 rounded object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium">{ad.title}</p>
                              <p className="text-xs text-muted-foreground">
                                Budget: ₹{ad.budget}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {ad.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs">
                              {format(new Date(ad.start_date), "MMM dd")} - {format(new Date(ad.end_date), "MMM dd")}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(ad.end_date) < new Date() 
                                ? "Ended" 
                                : `${Math.ceil(
                                    (new Date(ad.end_date).getTime() - new Date().getTime()) / 
                                    (1000 * 60 * 60 * 24)
                                  )} days left`
                              }
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(ad)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Eye className="h-3 w-3" />
                                <span className="text-xs">{ad.impressions || 0}</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <MousePointer className="h-3 w-3" />
                                <span className="text-xs">{ad.clicks || 0}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                              <TrendingUp className="h-3 w-3 text-primary" />
                              <span className="text-xs font-medium">
                                {ad.impressions 
                                  ? Math.round((ad.clicks / ad.impressions) * 100) 
                                  : 0}%
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              {ad.status === "active" ? (
                                <DropdownMenuItem 
                                  onClick={() => handleStatusChange(ad.id, "paused")}
                                >
                                  Pause
                                </DropdownMenuItem>
                              ) : ad.status === "paused" ? (
                                <DropdownMenuItem 
                                  onClick={() => handleStatusChange(ad.id, "active")}
                                >
                                  Activate
                                </DropdownMenuItem>
                              ) : null}
                              <DropdownMenuItem className="text-destructive">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-2">No {activeTab} advertisements found</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {/* Add navigation to create ad */}}
                >
                  Create a new ad
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BusinessAdsDashboard;
