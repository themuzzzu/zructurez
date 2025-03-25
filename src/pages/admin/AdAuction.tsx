
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdType } from "@/services/adService";
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
import { toast } from "sonner";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdAuctionPage = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAuction, setNewAuction] = useState({
    keyword: "",
    category: "product",
    min_bid: 50,
  });
  
  const { data: auctions = [], isLoading, refetch } = useQuery({
    queryKey: ['ad-auctions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ad_auctions')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        toast.error("Failed to load ad auctions");
        throw error;
      }
      
      return data;
    }
  });
  
  // Fetch ads for display in bidding
  const { data: ads = [] } = useQuery({
    queryKey: ['active-ads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('advertisements')
        .select('id, title, user_id, business_id, businesses:business_id(name)')
        .eq('status', 'active');
        
      if (error) {
        toast.error("Failed to load active ads");
        throw error;
      }
      
      return data;
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setNewAuction(prev => ({
        ...prev,
        [name]: parseFloat(value)
      }));
    } else {
      setNewAuction(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewAuction(prev => ({
      ...prev,
      category: e.target.value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('ad_auctions')
        .insert({
          keyword: newAuction.keyword,
          category: newAuction.category,
          min_bid: newAuction.min_bid,
          current_bid: 0,
          status: 'active'
        })
        .select();
        
      if (error) throw error;
      
      toast.success("Ad auction created successfully");
      setIsCreateDialogOpen(false);
      refetch();
      
      // Reset form
      setNewAuction({
        keyword: "",
        category: "product",
        min_bid: 50,
      });
    } catch (error: any) {
      toast.error(`Failed to create ad auction: ${error.message}`);
    }
  };
  
  const handlePlaceBid = async (auctionId: string, adId: string, currentBid: number, minBid: number) => {
    try {
      const bidAmount = Math.max(currentBid + 5, minBid); // Increment by at least 5
      
      // First update the auction with the new bid
      const { error: auctionError } = await supabase
        .from('ad_auctions')
        .update({
          current_bid: bidAmount,
          winning_ad_id: adId
        })
        .eq('id', auctionId);
        
      if (auctionError) throw auctionError;
      
      // Then record the bid in the bid history
      // Note: This would require a 'ad_bids' table in a real implementation
      try {
        await supabase.rpc('record_ad_bid', { 
          auction_id: auctionId,
          ad_id: adId,
          bid_amount: bidAmount
        });
      } catch (rpcError) {
        console.log("RPC error - bid recorded in auction but not in history:", rpcError);
      }
      
      toast.success(`Bid of ₹${bidAmount} placed successfully`);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to place bid: ${error.message}`);
    }
  };
  
  return (
    <div className="container py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Keyword Auction System</h1>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Auction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Keyword Auction</DialogTitle>
              <DialogDescription>
                Set up a keyword auction for advertisers to bid on
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="keyword">Keyword or Phrase</Label>
                <Input 
                  id="keyword"
                  name="keyword"
                  placeholder="e.g., shoes, electronics, fitness"
                  value={newAuction.keyword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newAuction.category}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="product">Product</option>
                  <option value="service">Service</option>
                  <option value="business">Business</option>
                  <option value="general">General</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="min_bid">Minimum Bid (₹)</Label>
                <Input 
                  id="min_bid"
                  name="min_bid"
                  type="number"
                  min="10"
                  step="5"
                  value={newAuction.min_bid}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">Create Auction</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Keyword Auctions</CardTitle>
          <CardDescription>Bid on keywords to have your ads shown when users search for these terms</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Loading auctions...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Bid</TableHead>
                  <TableHead>Min. Bid</TableHead>
                  <TableHead>Current Winner</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auctions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No active auctions found. Create your first keyword auction.
                    </TableCell>
                  </TableRow>
                ) : (
                  auctions.map((auction) => {
                    // Find the winning ad if there is one
                    const winningAd = auction.winning_ad_id ? 
                      ads.find(ad => ad.id === auction.winning_ad_id) : null;
                    
                    return (
                      <TableRow key={auction.id}>
                        <TableCell className="font-medium">{auction.keyword}</TableCell>
                        <TableCell className="capitalize">{auction.category}</TableCell>
                        <TableCell>
                          {auction.current_bid > 0 ? 
                            `₹${auction.current_bid}` : 
                            <span className="text-muted-foreground">No bids yet</span>
                          }
                        </TableCell>
                        <TableCell>₹{auction.min_bid}</TableCell>
                        <TableCell>
                          {winningAd ? (
                            <div className="font-medium text-sm">
                              <div>{winningAd.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {winningAd.businesses?.name || "Unknown Business"}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">No winner yet</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Place Bid
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Place Bid on "{auction.keyword}"</DialogTitle>
                                <DialogDescription>
                                  Current highest bid: 
                                  {auction.current_bid > 0 ? 
                                    ` ₹${auction.current_bid}` : 
                                    " No bids yet"
                                  }
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Select Your Ad</Label>
                                  <div className="grid gap-2 pt-2">
                                    {ads.length === 0 ? (
                                      <p className="text-muted-foreground">No active ads available for bidding</p>
                                    ) : (
                                      ads.map((ad) => (
                                        <div key={ad.id} className="flex items-center justify-between p-2 border rounded-md">
                                          <div>
                                            <div className="font-medium">{ad.title}</div>
                                            <div className="text-sm text-muted-foreground">
                                              {ad.businesses?.name || "Unknown Business"}
                                            </div>
                                          </div>
                                          <Button 
                                            size="sm"
                                            onClick={() => {
                                              handlePlaceBid(
                                                auction.id,
                                                ad.id,
                                                auction.current_bid,
                                                auction.min_bid
                                              );
                                            }}
                                          >
                                            Bid ₹{Math.max(auction.current_bid + 5, auction.min_bid)}
                                          </Button>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Auction Benefits</CardTitle>
            <CardDescription>Why bid on keywords?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </div>
              <div>
                <h3 className="font-medium">Targeted Visibility</h3>
                <p className="text-sm text-muted-foreground">Your ads appear when users search for specific keywords related to your business</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div>
                <h3 className="font-medium">Higher Conversion Rates</h3>
                <p className="text-sm text-muted-foreground">Better ROI as users are actively searching for your products or services</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              </div>
              <div>
                <h3 className="font-medium">Market Positioning</h3>
                <p className="text-sm text-muted-foreground">Outbid competitors for key search terms in your industry</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Keywords</CardTitle>
            <CardDescription>Keywords with highest engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Handmade Jewelry</p>
                  <p className="text-sm text-muted-foreground">Product category</p>
                </div>
                <div className="text-sm text-right">
                  <p className="font-medium">12.4%</p>
                  <p className="text-muted-foreground">CTR</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Interior Design</p>
                  <p className="text-sm text-muted-foreground">Service category</p>
                </div>
                <div className="text-sm text-right">
                  <p className="font-medium">10.8%</p>
                  <p className="text-muted-foreground">CTR</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Organic Food</p>
                  <p className="text-sm text-muted-foreground">Product category</p>
                </div>
                <div className="text-sm text-right">
                  <p className="font-medium">9.6%</p>
                  <p className="text-muted-foreground">CTR</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Local Bakery</p>
                  <p className="text-sm text-muted-foreground">Business category</p>
                </div>
                <div className="text-sm text-right">
                  <p className="font-medium">8.9%</p>
                  <p className="text-muted-foreground">CTR</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdAuctionPage;
