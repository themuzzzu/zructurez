
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchUserAds } from '@/services/adService';

interface AdDashboardProps {
  userId: string;
}

export const AdDashboard: React.FC<AdDashboardProps> = ({ userId }) => {
  const { data: ads } = useQuery({
    queryKey: ['user-ads', userId],
    queryFn: () => fetchUserAds(userId),
  });

  const activeAds = (ads || []).filter(ad => ad.status === 'active');
  
  const totalImpressions = activeAds.reduce((sum, ad) => sum + (ad.impressions || 0), 0);
  const totalClicks = activeAds.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
  const totalReach = activeAds.reduce((sum, ad) => sum + (ad.reach || 0), 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Ad Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{activeAds.length}</div>
              <div className="text-sm text-muted-foreground">Active Ads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalImpressions}</div>
              <div className="text-sm text-muted-foreground">Total Impressions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalClicks}</div>
              <div className="text-sm text-muted-foreground">Total Clicks</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
