
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdManagementTable } from "@/components/admin/AdManagementTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AdType, AdStatus, AdFormat, Advertisement } from "@/services/adService";
import { useNavigate } from "react-router-dom";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { DateRangePicker } from "@/components/ui/date-range-picker";

// Mock data for demonstration
const mockAds: Advertisement[] = [
  {
    id: "ad-1",
    title: "Summer Collection",
    type: "product",
    format: "standard",
    reference_id: "product-123",
    status: "active",
    budget: 500,
    start_date: "2023-06-01",
    end_date: "2023-08-31",
    impressions: 1240,
    clicks: 56,
    user_id: "user-123",
    description: "Summer collection products",
    location: "Global",
    image_url: null,
    video_url: null,
    carousel_images: null,
    created_at: "2023-05-20"
  },
  {
    id: "ad-2",
    title: "New Store Opening",
    type: "business",
    format: "standard",
    reference_id: "business-456",
    status: "active",
    budget: 750,
    start_date: "2023-05-15",
    end_date: "2023-07-15",
    impressions: 3600,
    clicks: 120,
    user_id: "user-456",
    description: "Grand opening of our new store",
    location: "Local",
    image_url: null,
    video_url: null,
    carousel_images: null,
    created_at: "2023-04-30"
  },
  {
    id: "ad-3",
    title: "Home Cleaning Services",
    type: "service",
    format: "standard",
    reference_id: "service-789",
    status: "paused",
    budget: 300,
    start_date: "2023-04-01",
    end_date: "2023-06-30",
    impressions: 840,
    clicks: 32,
    user_id: "user-789",
    description: "Professional home cleaning services",
    location: "Regional",
    image_url: null,
    video_url: null,
    carousel_images: null,
    created_at: "2023-03-15"
  },
  {
    id: "ad-4",
    title: "Tech Workshop",
    type: "sponsored",
    format: "standard",
    reference_id: "https://example.com/workshop",
    status: "completed",
    budget: 200,
    start_date: "2023-03-01",
    end_date: "2023-03-31",
    impressions: 1800,
    clicks: 75,
    user_id: "user-101",
    description: "Learn the latest tech skills",
    location: "Online",
    image_url: null,
    video_url: null,
    carousel_images: null,
    created_at: "2023-02-15"
  },
];

// Mock data for charts
const adPerformanceData = [
  { name: "Jun 1", impressions: 400, clicks: 24 },
  { name: "Jun 2", impressions: 300, clicks: 18 },
  { name: "Jun 3", impressions: 520, clicks: 35 },
  { name: "Jun 4", impressions: 480, clicks: 28 },
  { name: "Jun 5", impressions: 350, clicks: 21 },
  { name: "Jun 6", impressions: 600, clicks: 42 },
  { name: "Jun 7", impressions: 450, clicks: 32 },
];

export default function AdDashboard() {
  const navigate = useNavigate();
  const [ads] = useState<Advertisement[]>(mockAds);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<AdType | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<AdStatus | "all">("all");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(2023, 5, 1),
    to: new Date(2023, 5, 7),
  });

  const filteredAds = ads.filter((ad) => {
    // Filter by search query
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by type
    const matchesType = selectedType === "all" || ad.type === selectedType;

    // Filter by status
    const matchesStatus = selectedStatus === "all" || ad.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate metrics
  const totalImpressions = ads.reduce((sum, ad) => sum + (ad.impressions || 0), 0);
  const totalClicks = ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
  const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  const handleStatusChange = (id: string, newStatus: AdStatus) => {
    console.log(`Changing status of ad ${id} to ${newStatus}`);
    // In a real implementation, you would update the status in your database
  };

  const handleDelete = (id: string) => {
    console.log(`Deleting ad ${id}`);
    // In a real implementation, you would delete the ad from your database
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ad Dashboard</h1>
        <Button onClick={() => navigate("/admin/ads/create")}>Create New Ad</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average CTR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageCTR.toFixed(2)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Ads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ads.filter(ad => ad.status === 'active').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ad Performance</CardTitle>
          <CardDescription>Daily impressions and clicks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <DateRangePicker date={dateRange} onSelect={setDateRange} />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={adPerformanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="impressions" fill="#4338ca" name="Impressions" />
                <Bar dataKey="clicks" fill="#60a5fa" name="Clicks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Ads</TabsTrigger>
          <TabsTrigger value="all">All Ads</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search ads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sm:w-72"
            />
            <div className="flex gap-2 ml-auto">
              <Select value={selectedType} onValueChange={(value) => {
                const newValue = value as AdType | "all";
                setSelectedType(newValue);
              }}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="sponsored">Sponsored</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <AdManagementTable
                ads={filteredAds.filter((ad) => ad.status === "active")}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="all" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search ads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sm:w-72"
            />
            <div className="flex gap-2 ml-auto">
              <Select value={selectedType} onValueChange={(value) => {
                const newValue = value as AdType | "all";
                setSelectedType(newValue);
              }}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="sponsored">Sponsored</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as AdStatus | "all")}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <AdManagementTable
                ads={filteredAds}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
