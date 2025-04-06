
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Advertisement, AdStatus, AdFormat } from '@/services/adService';

export function AdDashboard() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | AdStatus>('all');

  useEffect(() => {
    // Simulate fetching user ads
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Mock data for demonstration
        const mockAds: Advertisement[] = [
          {
            id: '1',
            title: 'Summer Sale',
            type: 'product',
            reference_id: 'prod-123',
            budget: 500,
            status: 'active',
            start_date: '2023-06-01',
            end_date: '2023-08-31',
            impressions: 1240,
            clicks: 56,
            format: 'banner',
            image_url: 'https://example.com/ads/summer-sale.jpg',
            description: 'Summer sale with discounts up to 50%',
            user_id: 'user-123',
            location: 'Global',
            video_url: null,
            carousel_images: null,
            created_at: '2023-05-15',
            reach: 5000
          },
          {
            id: '2',
            title: 'Business Promotion',
            type: 'business',
            reference_id: 'biz-456',
            budget: 300,
            status: 'paused',
            start_date: '2023-05-15',
            end_date: '2023-07-15',
            impressions: 840,
            clicks: 32,
            format: 'standard',
            image_url: 'https://example.com/ads/business-promo.jpg',
            description: 'Promote your local business',
            user_id: 'user-123',
            location: 'Local',
            video_url: null,
            carousel_images: null,
            created_at: '2023-05-10',
            reach: 2500
          },
          {
            id: '3',
            title: 'Service Spotlight',
            type: 'service',
            reference_id: 'serv-789',
            budget: 200,
            status: 'completed',
            start_date: '2023-04-01',
            end_date: '2023-05-01',
            impressions: 3600,
            clicks: 120,
            format: 'standard',
            image_url: 'https://example.com/ads/service-spotlight.jpg',
            description: 'Showcase your professional services',
            user_id: 'user-123',
            location: 'Regional',
            video_url: null,
            carousel_images: null,
            created_at: '2023-03-20',
            reach: 8000
          }
        ];
        
        setAds(mockAds);
      } catch (error) {
        console.error('Error fetching ads:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const filteredAds = activeTab === 'all' 
    ? ads 
    : ads.filter(ad => ad.status === activeTab);
  
  const activeAdsCount = ads.filter(ad => ad.status === 'active').length;
  const pausedAdsCount = ads.filter(ad => ad.status === 'paused').length;
  const completedAdsCount = ads.filter(ad => ad.status === 'completed').length;
  const totalSpend = ads.reduce((total, ad) => total + (ad.budget || 0), 0);
  const totalImpressions = ads.reduce((total, ad) => total + (ad.impressions || 0), 0);
  const totalClicks = ads.reduce((total, ad) => total + (ad.clicks || 0), 0);
  const avgCTR = totalImpressions > 0 
    ? ((totalClicks / totalImpressions) * 100).toFixed(2) 
    : '0.00';
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAdsCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpend.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Impressions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average CTR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCTR}%</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="all">All ({ads.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeAdsCount})</TabsTrigger>
          <TabsTrigger value="paused">Paused ({pausedAdsCount})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedAdsCount})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {isLoading ? (
            <div className="text-center py-8">Loading your ads...</div>
          ) : filteredAds.length === 0 ? (
            <div className="text-center py-8">No ads found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAds.map(ad => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="active" className="mt-4">
          {isLoading ? (
            <div className="text-center py-8">Loading active ads...</div>
          ) : filteredAds.length === 0 ? (
            <div className="text-center py-8">No active ads found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAds.map(ad => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="paused" className="mt-4">
          {isLoading ? (
            <div className="text-center py-8">Loading paused ads...</div>
          ) : filteredAds.length === 0 ? (
            <div className="text-center py-8">No paused ads found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAds.map(ad => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          {isLoading ? (
            <div className="text-center py-8">Loading completed ads...</div>
          ) : filteredAds.length === 0 ? (
            <div className="text-center py-8">No completed ads found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAds.map(ad => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface AdCardProps {
  ad: Advertisement;
}

function AdCard({ ad }: AdCardProps) {
  const getStatusColor = (status?: AdStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <div 
        className="h-40 bg-cover bg-center relative"
        style={{ 
          backgroundImage: ad.image_url ? `url(${ad.image_url})` : 'url(/placeholders/image-placeholder.jpg)' 
        }}
      >
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(ad.status)}`}>
          {ad.status}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium mb-1">{ad.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {ad.description || 'No description provided'}
        </p>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-muted-foreground">Budget</div>
            <div className="font-medium">${ad.budget?.toFixed(2) || '0.00'}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Type</div>
            <div className="font-medium capitalize">{ad.type}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Impressions</div>
            <div className="font-medium">{ad.impressions?.toLocaleString() || '0'}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Clicks</div>
            <div className="font-medium">{ad.clicks?.toLocaleString() || '0'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
