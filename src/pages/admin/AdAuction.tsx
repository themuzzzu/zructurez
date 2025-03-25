
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Advertisement } from "@/services/adService";
import { toast } from "sonner";
import { format } from "date-fns";

interface Auction {
  id: string;
  ad_placement_id: string;
  start_time: string;
  end_time: string;
  status: string;
  min_bid: number;
  placement_name?: string;
}

interface AdPlacement {
  id: string;
  name: string;
  type: string;
  location: string;
  cpm_rate: number;
  cpc_rate: number;
  description: string;
}

export default function AdAuction() {
  const [auctionId, setAuctionId] = useState("");
  const [adId, setAdId] = useState("");
  const [bidAmount, setBidAmount] = useState("");

  const { data: auctions, isLoading: auctionsLoading } = useQuery({
    queryKey: ["auctions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ad_auctions")
        .select("*, ad_placements(name)");

      if (error) throw error;

      // Transform data to include placement name
      return data.map((auction) => ({
        ...auction,
        placement_name: auction.ad_placements?.name,
      }));
    },
  });

  const { data: adPlacements, isLoading: placementsLoading } = useQuery({
    queryKey: ["ad-placements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ad_placements")
        .select("*")
        .eq("active", true);

      if (error) throw error;
      return data;
    },
  });

  const { data: ads, isLoading: adsLoading } = useQuery({
    queryKey: ["user-ads"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("advertisements")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data as Advertisement[];
    },
  });

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auctionId || !adId || !bidAmount) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { error } = await supabase.from("ad_auction_bids").insert({
        auction_id: auctionId,
        ad_id: adId,
        bid_amount: parseFloat(bidAmount),
      });

      if (error) throw error;

      toast.success("Bid submitted successfully");
      setBidAmount("");
    } catch (error) {
      console.error("Error submitting bid:", error);
      toast.error("Failed to submit bid");
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Ad Auction</h1>
          <p className="text-muted-foreground mt-1">Bid on premium ad slots for your advertisements</p>
        </div>
      </div>

      <Tabs defaultValue="active-auctions" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="active-auctions">Active Auctions</TabsTrigger>
          <TabsTrigger value="place-bid">Place Bid</TabsTrigger>
          <TabsTrigger value="my-bids" className="hidden md:block">My Bids</TabsTrigger>
        </TabsList>

        <TabsContent value="active-auctions" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Auction Slots</CardTitle>
              <CardDescription>
                Bid on these placements to showcase your advertisements
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto">
              <Table>
                <TableCaption>A list of active ad placement auctions</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Ad Placement</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Min Bid</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!auctionsLoading && auctions ? (
                    auctions.map((auction) => (
                      <TableRow key={auction.id}>
                        <TableCell className="font-medium">{auction.placement_name}</TableCell>
                        <TableCell>
                          {format(new Date(auction.start_time), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          {format(new Date(auction.end_time), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>${auction.min_bid.toFixed(2)}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              auction.status === "active"
                                ? "bg-green-100 text-green-800"
                                : auction.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {auction.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setAuctionId(auction.id);
                              setBidAmount(auction.min_bid.toString());
                              document.getElementById("place-bid-tab")?.click();
                            }}
                          >
                            Place Bid
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        {auctionsLoading ? "Loading..." : "No auctions available"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="place-bid" id="place-bid-tab" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Bid</CardTitle>
              <CardDescription>
                Enter your bid details for the selected ad placement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitBid} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="auction-slot">Auction Slot</Label>
                    <select
                      id="auction-slot"
                      value={auctionId}
                      onChange={(e) => setAuctionId(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Select an auction slot</option>
                      {!auctionsLoading &&
                        auctions?.map((auction) => (
                          <option key={auction.id} value={auction.id}>
                            {auction.placement_name} (${auction.min_bid} min)
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="advertisement">Your Advertisement</Label>
                    <select
                      id="advertisement"
                      value={adId}
                      onChange={(e) => setAdId(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Select your advertisement</option>
                      {!adsLoading &&
                        ads?.map((ad) => (
                          <option key={ad.id} value={ad.id}>
                            {ad.title}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bid-amount">Bid Amount ($)</Label>
                  <Input
                    id="bid-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter your bid amount"
                    className="w-full"
                    required
                  />
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  Submit Bid
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-bids" className="space-y-4 mt-6">
          {/* My bids content here */}
          <Card>
            <CardHeader>
              <CardTitle>Your Active Bids</CardTitle>
              <CardDescription>
                Track the status of your bids on ad placements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Bids table would go here */}
              <div className="text-center py-10 text-muted-foreground">
                No active bids found
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
