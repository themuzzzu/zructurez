import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ArrowRight, Check, DollarSign, Eye, Image as ImageIcon, MousePointer, Sparkles, Target, Video } from "lucide-react";

export default function AdAuction() {
  const { data: currentUser } = useCurrentUser();
  const [auctions, setAuctions] = useState<any[]>([]);
  const [newAuctionTitle, setNewAuctionTitle] = useState("");
  const [newAuctionDescription, setNewAuctionDescription] = useState("");
  const [newAuctionStartDate, setNewAuctionStartDate] = useState<Date | undefined>(new Date());
  const [newAuctionEndDate, setNewAuctionEndDate] = useState<Date | undefined>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [isCreating, setIsCreating] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState(100);
  const [isBidding, setIsBidding] = useState(false);

  // Fetch auctions
  useEffect(() => {
    const fetchAuctions = async () => {
      const { data, error } = await supabase
        .from('ad_auctions')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) {
        console.error("Error fetching auctions:", error);
        toast.error("Failed to load auctions");
      } else {
        setAuctions(data || []);
      }
    };

    fetchAuctions();
  }, []);

  // Handle auction creation
  const handleCreateAuction = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to create an auction");
      return;
    }

    if (!newAuctionTitle || !newAuctionDescription || !newAuctionStartDate || !newAuctionEndDate) {
      toast.error("Please fill in all auction details");
      return;
    }

    setIsCreating(true);

    try {
      const { error } = await supabase
        .from('ad_auctions')
        .insert({
          title: newAuctionTitle,
          description: newAuctionDescription,
          start_date: newAuctionStartDate.toISOString(),
          end_date: newAuctionEndDate.toISOString(),
          created_by: currentUser.id
        });

      if (error) throw error;

      toast.success("Auction created successfully");
      setNewAuctionTitle("");
      setNewAuctionDescription("");
      setNewAuctionStartDate(new Date());
      setNewAuctionEndDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

      // Refresh auctions
      const { data } = await supabase
        .from('ad_auctions')
        .select('*')
        .order('start_date', { ascending: false });
      setAuctions(data || []);
    } catch (error) {
      console.error("Error creating auction:", error);
      toast.error("Failed to create auction");
    } finally {
      setIsCreating(false);
    }
  };

  // Handle adding a bid
  const handleAddBid = async (auctionId: string) => {
    if (!currentUser) return;
  
    try {
      // Get my current ad
      const { data: myAds } = await supabase
        .from('advertisements')
        .select('*, businesses(name)')
        .eq('user_id', currentUser.id);
        
      // Ensure myAds is an array before using find()
      const myAdsArray = myAds || [];
      
      // Now we can safely use find() on the array
      const adToUse = myAdsArray.find(ad => ad.status === 'active');
    
      if (!adToUse) {
        toast.error("You need to create an active ad first");
        return;
      }
    
      setIsBidding(true);
    
      // Insert the bid
      const { error } = await supabase
        .from('ad_bids')
        .insert({
          auction_id: auctionId,
          ad_id: adToUse.id,
          user_id: currentUser.id,
          bid_amount: bidAmount
        });
    
      if (error) throw error;
    
      toast.success("Bid placed successfully");
      setBidAmount(100);
      setSelectedAuction(null);
    } catch (error) {
      console.error("Error adding bid:", error);
      toast.error("Failed to place bid");
    } finally {
      setIsBidding(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Ad Auction Management</h1>

      {/* Create Auction Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Auction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="auction-title">Auction Title</Label>
            <Input
              id="auction-title"
              value={newAuctionTitle}
              onChange={(e) => setNewAuctionTitle(e.target.value)}
              placeholder="Enter auction title"
            />
          </div>
          <div>
            <Label htmlFor="auction-description">Auction Description</Label>
            <Textarea
              id="auction-description"
              value={newAuctionDescription}
              onChange={(e) => setNewAuctionDescription(e.target.value)}
              placeholder="Enter auction description"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="auction-start-date">Start Date</Label>
              <Calendar
                id="auction-start-date"
                mode="single"
                selected={newAuctionStartDate}
                onSelect={setNewAuctionStartDate}
              />
            </div>
            <div>
              <Label htmlFor="auction-end-date">End Date</Label>
              <Calendar
                id="auction-end-date"
                mode="single"
                selected={newAuctionEndDate}
                onSelect={setNewAuctionEndDate}
                disabled={(date) => newAuctionStartDate && date < newAuctionStartDate}
              />
            </div>
          </div>
          <Button onClick={handleCreateAuction} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Auction"}
          </Button>
        </CardContent>
      </Card>

      {/* Auction List */}
      <h2 className="text-xl font-semibold mb-2">Current Auctions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {auctions.map((auction) => (
          <Card key={auction.id}>
            <CardHeader>
              <CardTitle>{auction.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{auction.description}</p>
              <p className="text-xs text-muted-foreground">
                Start Date: {format(new Date(auction.start_date), "PPP")}
              </p>
              <p className="text-xs text-muted-foreground">
                End Date: {format(new Date(auction.end_date), "PPP")}
              </p>
              {/* Bidding Section */}
              {selectedAuction === auction.id ? (
                <div className="space-y-2">
                  <Label htmlFor="bid-amount">Bid Amount</Label>
                  <Input
                    id="bid-amount"
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    placeholder="Enter bid amount"
                  />
                  <Button onClick={() => handleAddBid(auction.id)} disabled={isBidding}>
                    {isBidding ? "Bidding..." : "Place Bid"}
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setSelectedAuction(auction.id)}>
                  Bid on this Auction
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
