
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Advertisement } from '@/services/adService';

interface AdAuction {
  id: string;
  keyword: string;
  category: string;
  min_bid: number;
  current_bid: number;
  winning_ad_id: string | null;
  status: 'active' | 'completed' | 'canceled';
}

export default function AdAuctionPage() {
  const [auctions, setAuctions] = useState<AdAuction[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Mock data
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Mock auctions
        const mockAuctions: AdAuction[] = [
          {
            id: 'auction-1',
            keyword: 'local business',
            category: 'business',
            min_bid: 50,
            current_bid: 120,
            winning_ad_id: 'ad-2',
            status: 'active'
          },
          {
            id: 'auction-2',
            keyword: 'home services',
            category: 'service',
            min_bid: 40,
            current_bid: 85,
            winning_ad_id: 'ad-3',
            status: 'active'
          },
          {
            id: 'auction-3',
            keyword: 'handmade products',
            category: 'product',
            min_bid: 60,
            current_bid: 60,
            winning_ad_id: null,
            status: 'active'
          },
          {
            id: 'auction-4',
            keyword: 'tech gadgets',
            category: 'product',
            min_bid: 100,
            current_bid: 250,
            winning_ad_id: 'ad-1',
            status: 'completed'
          }
        ];
        
        // Mock ads as Advertisement objects
        const mockAds: Advertisement[] = [
          {
            id: 'ad-1',
            title: 'Tech Gadget Sale',
            type: 'product',
            format: 'banner',
            reference_id: 'prod-123',
            budget: 500,
            status: 'active',
            user_id: 'user-123',
            start_date: '2023-06-01',
            end_date: '2023-08-31',
            impressions: 1240,
            clicks: 56,
            image_url: 'https://example.com/ads/gadget-sale.jpg',
            description: 'Latest tech gadgets on sale',
            location: 'Global',
            video_url: null,
            carousel_images: null,
            created_at: '2023-05-15',
            business_id: 'business-1'
          },
          {
            id: 'ad-2',
            title: 'Local Business Promotion',
            type: 'business',
            format: 'standard',
            reference_id: 'biz-456',
            budget: 300,
            status: 'active',
            user_id: 'user-456',
            start_date: '2023-05-15',
            end_date: '2023-07-15',
            impressions: 840,
            clicks: 32,
            image_url: 'https://example.com/ads/local-business.jpg',
            description: 'Support local businesses',
            location: 'Local',
            video_url: null,
            carousel_images: null,
            created_at: '2023-05-10',
            business_id: 'business-2'
          },
          {
            id: 'ad-3',
            title: 'Home Services',
            type: 'service',
            format: 'standard',
            reference_id: 'serv-789',
            budget: 200,
            status: 'active',
            user_id: 'user-789',
            start_date: '2023-04-01',
            end_date: '2023-06-30',
            impressions: 620,
            clicks: 45,
            image_url: 'https://example.com/ads/home-services.jpg',
            description: 'Professional home services',
            location: 'Regional',
            video_url: null,
            carousel_images: null,
            created_at: '2023-03-20',
            business_id: 'business-3'
          }
        ];
        
        setAuctions(mockAuctions);
        setAds(mockAds);
      } catch (error) {
        console.error('Error fetching auction data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const getWinningAdTitle = (auctionId: string) => {
    const auction = auctions.find(a => a.id === auctionId);
    if (!auction || !auction.winning_ad_id) return 'No bids';
    
    const ad = ads.find(a => a.id === auction.winning_ad_id);
    return ad ? ad.title : 'Unknown Ad';
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ad Auctions</h1>
        <Button>Create New Auction</Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Auction Performance</CardTitle>
          <CardDescription>Current active ad auctions and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{auctions.filter(a => a.status === 'active').length}</div>
                <p className="text-muted-foreground">Active Auctions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">${auctions.reduce((total, auction) => 
                  total + (auction.status === 'active' ? auction.current_bid : 0), 0)}</div>
                <p className="text-muted-foreground">Current Value</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{auctions.filter(a => a.winning_ad_id).length}</div>
                <p className="text-muted-foreground">Active Bids</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>All Auctions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading auctions...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Bid</TableHead>
                  <TableHead>Min. Bid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Winning Ad</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auctions.map((auction) => (
                  <TableRow key={auction.id}>
                    <TableCell className="font-medium">{auction.keyword}</TableCell>
                    <TableCell className="capitalize">{auction.category}</TableCell>
                    <TableCell>${auction.current_bid}</TableCell>
                    <TableCell>${auction.min_bid}</TableCell>
                    <TableCell>
                      <Badge
                        variant={auction.status === 'active' ? 'success' : 
                                auction.status === 'completed' ? 'secondary' : 'destructive'}
                      >
                        {auction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{getWinningAdTitle(auction.id)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Details</Button>
                        {auction.status === 'active' && (
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                            End
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
