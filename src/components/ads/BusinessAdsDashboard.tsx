import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdCampaign } from "@/types/advertising";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from "recharts";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  CalendarIcon, 
  ClockIcon, 
  ChevronRightIcon, 
  EyeIcon, 
  MousePointerClickIcon,
  ActivityIcon 
} from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface BusinessAdsDashboardProps {
  businessId?: string;
}

export const BusinessAdsDashboard = ({ businessId }: BusinessAdsDashboardProps) => {
  const [activeTab, setActiveTab] = useState("active");

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ["business-ads", businessId, activeTab],
    queryFn: async () => {
      if (!businessId) return [];

      let query = supabase
        .from('advertisements')
        .select('*')
        .eq('business_id', businessId);

      switch (activeTab) {
        case "active":
          query = query.eq('status', 'active');
          break;
        case "pending":
          query = query.eq('status', 'pending');
          break;
        case "expired":
          query = query.eq('status', 'expired');
          break;
        // All ads fall through to no extra filter
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      
      // Map database fields to AdCampaign fields
      return data.map(ad => ({
        id: ad.id,
        business_id: ad.business_id,
        title: ad.title,
        description: ad.description,
        image_url: ad.image_url,
        start_date: ad.start_date,
        end_date: ad.end_date,
        status: ad.status,
        clicks: ad.clicks || 0,
        impressions: ad.reach || 0,
        created_at: ad.created_at,
        
        // Keep additional database fields
        budget: ad.budget,
        carousel_images: ad.carousel_images,
        format: ad.format,
        location: ad.location,
        reach: ad.reach,
        reference_id: ad.reference_id,
        targeting_age_max: ad.targeting_age_max,
        targeting_age_min: ad.targeting_age_min,
        targeting_gender: ad.targeting_gender,
        targeting_interests: ad.targeting_interests,
        targeting_locations: ad.targeting_locations,
        type: ad.type,
        user_id: ad.user_id,
        video_url: ad.video_url
      } as AdCampaign));
    },
    enabled: !!businessId
  });

  // Calculate some stats for charts
  const totalImpressions = campaigns.reduce((sum, campaign) => sum + (campaign.impressions || 0), 0);
  const totalClicks = campaigns.reduce((sum, campaign) => sum + (campaign.clicks || 0), 0);
  const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) : "0";
  
  // Prepare chart data
  const chartData = [
    { name: 'Impressions', value: totalImpressions },
    { name: 'Clicks', value: totalClicks }
  ];
  
  const COLORS = ['#8b5cf6', '#f97316'];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!campaigns.length) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium mb-2">No {activeTab} advertisements</h3>
        <p className="text-muted-foreground">
          {activeTab === "active" 
            ? "You don't have any active ad campaigns." 
            : activeTab === "pending" 
            ? "You don't have any pending ad campaigns."
            : activeTab === "expired" 
            ? "You don't have any expired ad campaigns."
            : "You don't have any ad campaigns."}
        </p>
      </div>
    );
  }

  // Stat cards for display
  const statCards = [
    {
      title: "Impressions",
      value: totalImpressions.toLocaleString(),
      icon: <EyeIcon className="h-4 w-4" />
    },
    {
      title: "Clicks",
      value: totalClicks.toLocaleString(),
      icon: <MousePointerClickIcon className="h-4 w-4" />
    },
    {
      title: "CTR",
      value: `${averageCTR}%`,
      icon: <ActivityIcon className="h-4 w-4" />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((card, index) => (
          <div 
            key={index}
            className="bg-muted/50 rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-muted-foreground">{card.title}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Performance Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Campaign Status</h3>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="space-y-4">
              {campaigns.map((campaign) => (
                <div 
                  key={campaign.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="grid grid-cols-5">
                    {campaign.image_url && (
                      <div className="col-span-2">
                        <AspectRatio ratio={16/9}>
                          <img 
                            src={campaign.image_url} 
                            alt={campaign.title}
                            className="w-full h-full object-cover"
                          />
                        </AspectRatio>
                      </div>
                    )}
                    <div className={`p-3 ${campaign.image_url ? 'col-span-3' : 'col-span-5'}`}>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium">{campaign.title}</h4>
                        <Badge className={
                          campaign.status === 'active' ? 'bg-green-500' : 
                          campaign.status === 'pending' ? 'bg-yellow-500' : 
                          'bg-gray-500'
                        }>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {campaign.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 text-xs">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <CalendarIcon className="h-3 w-3" />
                          <span>
                            {format(new Date(campaign.start_date), "MMM dd")} - {format(new Date(campaign.end_date), "MMM dd, yyyy")}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <EyeIcon className="h-3 w-3" />
                          <span>{campaign.impressions || 0} views</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MousePointerClickIcon className="h-3 w-3" />
                          <span>{campaign.clicks || 0} clicks</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
