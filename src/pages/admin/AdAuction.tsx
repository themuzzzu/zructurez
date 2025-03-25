
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, DollarSign, TrendingUp, BarChart, Tag } from "lucide-react";
import { toast } from "sonner";
import { AdminSchemas, adminApiMiddleware } from "@/utils/adminApiMiddleware";

const AdAuction = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [minBid, setMinBid] = useState<string>("50");
  const [isUpdatingMinBid, setIsUpdatingMinBid] = useState(false);
  
  // Fetch active ad auctions
  const { data: auctions = [], isLoading, refetch } = useQuery({
    queryKey: ['ad-auctions', selectedCategory],
    queryFn: async () => {
      let query = supabase.from('ad_auctions').select(`
        id,
        keyword,
        category,
        current_bid,
        min_bid,
        winning_ad_id,
        advertisements (
          id,
          title,
          user_id,
          business_id,
          businesses (name)
        )
      `);
      
      if (selectedCategory !== "all") {
        query = query.eq('category', selectedCategory);
      }
      
      const { data, error } = await query.order('current_bid', { ascending: false });
      
      if (error) {
        toast.error("Failed to load auction data");
        throw error;
      }
      
      return data || [];
    }
  });
  
  // Fetch ad categories
  const { data: categories = [] } = useQuery({
    queryKey: ['ad-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ad_categories')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data || [];
    }
  });
  
  // Update minimum bid for a category
  const handleUpdateMinBid = async () => {
    if (selectedCategory === "all") {
      toast.error("Please select a specific category to update minimum bid");
      return;
    }
    
    setIsUpdatingMinBid(true);
    
    try {
      const { error } = await supabase
        .from('ad_categories')
        .update({ min_bid: parseFloat(minBid) })
        .eq('name', selectedCategory);
        
      if (error) throw error;
      
      toast.success(`Minimum bid for ${selectedCategory} updated to ₹${minBid}`);
      refetch();
    } catch (error) {
      console.error('Error updating minimum bid:', error);
      toast.error("Failed to update minimum bid");
    } finally {
      setIsUpdatingMinBid(false);
    }
  };
  
  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
    toast.success("Auction data refreshed");
  };
  
  // Generate AI-optimized bid recommendations
  const generateBidRecommendations = async () => {
    toast.info("Generating AI bid recommendations...");
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-bid-recommendations', {
        body: { category: selectedCategory }
      });
      
      if (error) throw error;
      
      toast.success("Bid recommendations generated successfully");
      refetch();
    } catch (error) {
      console.error('Error generating bid recommendations:', error);
      toast.error("Failed to generate bid recommendations");
    }
  };
  
  return (
    <div className="container py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Ad Auction System</h1>
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
      
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Auctions</TabsTrigger>
          <TabsTrigger value="settings">Auction Settings</TabsTrigger>
          <TabsTrigger value="analytics">Bid Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Active Ad Auctions</CardTitle>
                  <CardDescription>Real-time ad auctions and current bids</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select 
                    value={selectedCategory} 
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword/Placement</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Bid (₹)</TableHead>
                    <TableHead>Min Bid (₹)</TableHead>
                    <TableHead>Current Winner</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Loading auction data...
                      </TableCell>
                    </TableRow>
                  ) : auctions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No active auctions found for {selectedCategory === "all" ? "any category" : selectedCategory}
                      </TableCell>
                    </TableRow>
                  ) : (
                    auctions.map((auction) => {
                      const winningAd = auction.advertisements?.find(ad => ad.id === auction.winning_ad_id);
                      return (
                        <TableRow key={auction.id}>
                          <TableCell className="font-medium">{auction.keyword}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{auction.category}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold">₹{auction.current_bid.toFixed(2)}</TableCell>
                          <TableCell>₹{auction.min_bid.toFixed(2)}</TableCell>
                          <TableCell>
                            {winningAd ? (
                              <span className="text-sm">
                                {winningAd.businesses?.name || "Unknown"} - {winningAd.title}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-sm">No winner yet</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-500">Active</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Auction Settings</CardTitle>
              <CardDescription>Configure bid settings for ad categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Category</h3>
                  <Select 
                    value={selectedCategory} 
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Minimum Bid (₹)</h3>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={minBid} 
                      onChange={(e) => setMinBid(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                    <Button 
                      onClick={handleUpdateMinBid} 
                      disabled={isUpdatingMinBid || selectedCategory === "all"}
                    >
                      Update
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">AI Optimization</h3>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={generateBidRecommendations}
                  >
                    <BarChart className="mr-2 h-4 w-4" />
                    Generate Bid Recommendations
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-4">Pricing Model Settings</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border p-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Pay-Per-Click (PPC)</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Advertisers pay per click on their ads. Current multiplier: 1.0x
                        </p>
                        <Input 
                          type="number" 
                          placeholder="PPC Multiplier" 
                          className="mt-2 w-32"
                          defaultValue="1.0"
                          min="0.1"
                          step="0.1"
                        />
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="border p-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Cost-Per-Impression (CPM)</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Advertisers pay per thousand impressions. Current rate: ₹15 per 1000
                        </p>
                        <Input 
                          type="number" 
                          placeholder="CPM Rate (₹)" 
                          className="mt-2 w-32"
                          defaultValue="15"
                          min="1"
                          step="1"
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bid Analytics & Optimization</CardTitle>
              <CardDescription>
                AI-powered bid performance analytics to optimize ad revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <Card className="p-4">
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold">₹154.25</div>
                    <p className="text-sm text-muted-foreground">Average Winning Bid</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold">₹12,432</div>
                    <p className="text-sm text-muted-foreground">Total Monthly Revenue</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold">3.7%</div>
                    <p className="text-sm text-muted-foreground">Average CTR</p>
                  </div>
                </Card>
              </div>
              
              <h3 className="font-medium mb-4">Category Performance</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Avg. Bid (₹)</TableHead>
                    <TableHead>CTR</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Recommended Min. Bid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.slice(0, 5).map((category, index) => {
                    // These would be real values in production
                    const avgBid = 100 + Math.random() * 200;
                    const ctr = 1 + Math.random() * 5;
                    const revenue = avgBid * 10 * (1 + Math.random());
                    const recommendedBid = avgBid * (0.8 + Math.random() * 0.4);
                    
                    return (
                      <TableRow key={category.id || index}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>₹{avgBid.toFixed(2)}</TableCell>
                        <TableCell>{ctr.toFixed(2)}%</TableCell>
                        <TableCell>₹{revenue.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className="font-medium text-primary">
                            ₹{recommendedBid.toFixed(2)}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              <div className="mt-6">
                <Button onClick={generateBidRecommendations}>
                  <Tag className="mr-2 h-4 w-4" />
                  Apply AI Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdAuction;
