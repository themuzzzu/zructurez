
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdForm } from "./AdForm";
import { useQuery } from "@tanstack/react-query";
import { fetchUserAds, Advertisement } from "@/services/adService";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, MousePointer, Plus } from "lucide-react";
import { format } from "date-fns";

export const AdDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("active");
  const [isCreateAdOpen, setIsCreateAdOpen] = useState(false);
  
  const { data: userAds = [], refetch: refetchAds } = useQuery<Advertisement[]>({
    queryKey: ['user-ads'],
    queryFn: fetchUserAds,
  });
  
  const filteredAds = userAds.filter(ad => {
    const now = new Date();
    const startDate = new Date(ad.start_date);
    const endDate = new Date(ad.end_date);
    
    switch (selectedTab) {
      case "active":
        return ad.status === "active" && now >= startDate && now <= endDate;
      case "scheduled":
        return ad.status === "active" && now < startDate;
      case "completed":
        return ad.status === "expired" || (ad.status === "active" && now > endDate);
      case "all":
      default:
        return true;
    }
  });
  
  const getAdPerformance = (ad: Advertisement) => {
    const clicks = ad.clicks || 0;
    const views = ad.reach || 0;
    const ctr = views > 0 ? (clicks / views * 100).toFixed(2) : 0;
    
    return { clicks, views, ctr };
  };
  
  const getStatusColor = (ad: Advertisement) => {
    const now = new Date();
    const startDate = new Date(ad.start_date);
    const endDate = new Date(ad.end_date);
    
    if (ad.status === "pending") return "bg-yellow-500";
    if (ad.status === "rejected") return "bg-red-500";
    if (now < startDate) return "bg-blue-500";
    if (now > endDate) return "bg-gray-500";
    return "bg-green-500";
  };
  
  const getStatusText = (ad: Advertisement) => {
    const now = new Date();
    const startDate = new Date(ad.start_date);
    const endDate = new Date(ad.end_date);
    
    if (ad.status === "pending") return "Pending";
    if (ad.status === "rejected") return "Rejected";
    if (now < startDate) return "Scheduled";
    if (now > endDate) return "Completed";
    return "Active";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-semibold">Ad Dashboard</h2>
        <Dialog open={isCreateAdOpen} onOpenChange={setIsCreateAdOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Ad
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] h-[90vh]">
            <DialogHeader>
              <DialogTitle>Create Advertisement</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-full pr-4">
              <AdForm 
                onSuccess={() => {
                  setIsCreateAdOpen(false);
                  refetchAds();
                }} 
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All Ads</TabsTrigger>
        </TabsList>
        
        <TabsContent value={selectedTab} className="space-y-4">
          {filteredAds.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-4">No advertisements found</p>
                <Button onClick={() => setIsCreateAdOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first ad
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredAds.map(ad => {
              const { clicks, views, ctr } = getAdPerformance(ad);
              return (
                <Card key={ad.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <CardTitle className="text-lg">{ad.title}</CardTitle>
                        <CardDescription>
                          {ad.type.charAt(0).toUpperCase() + ad.type.slice(1)} Advertisement
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(ad)}>
                        {getStatusText(ad)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {ad.image_url && (
                        <div className="relative h-40 rounded-md overflow-hidden">
                          <img 
                            src={ad.image_url} 
                            alt={ad.title} 
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="space-y-4">
                        <p className="text-sm">{ad.description}</p>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-md">
                            <Eye className="h-4 w-4 mb-1" />
                            <span className="text-sm font-medium">{views}</span>
                            <span className="text-xs text-muted-foreground">Views</span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-md">
                            <MousePointer className="h-4 w-4 mb-1" />
                            <span className="text-sm font-medium">{clicks}</span>
                            <span className="text-xs text-muted-foreground">Clicks</span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-md">
                            <span className="text-sm font-medium">{ctr}%</span>
                            <span className="text-xs text-muted-foreground">CTR</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {format(new Date(ad.start_date), "MMM d")} - {format(new Date(ad.end_date), "MMM d, yyyy")}
                            </span>
                          </div>
                          <span>•</span>
                          <span>Budget: ₹{ad.budget}</span>
                          <span>•</span>
                          <span>{ad.location}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
