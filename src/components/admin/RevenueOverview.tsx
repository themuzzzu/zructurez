
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Advertisement } from "@/services/adService";
import { formatDistanceToNow } from "date-fns";

interface RevenueOverviewProps {
  ads: Advertisement[];
}

export function RevenueOverview({ ads }: RevenueOverviewProps) {
  // Calculate revenue stats
  const totalAds = ads.length;
  const activeAds = ads.filter(ad => ad.status === "active").length;
  
  // Calculate estimated revenue (simple model)
  const estimatedRevenue = ads.reduce((total, ad) => {
    if (ad.status !== "active") return total;
    
    const impressions = ad.reach || 0;
    const clicks = ad.clicks || 0;
    
    // CPM revenue (₹15 per 1000 impressions)
    const cpmRevenue = (impressions / 1000) * 15;
    
    // CPC revenue (₹2 per click)
    const cpcRevenue = clicks * 2;
    
    return total + cpmRevenue + cpcRevenue;
  }, 0);
  
  // Get top performing ads by revenue
  const adRevenues = ads.map(ad => {
    const impressions = ad.reach || 0;
    const clicks = ad.clicks || 0;
    
    // Calculate estimated revenue
    const cpmRevenue = (impressions / 1000) * 15;
    const cpcRevenue = clicks * 2;
    const revenue = cpmRevenue + cpcRevenue;
    
    return {
      ...ad,
      revenue,
      startDate: new Date(ad.start_date),
      endDate: new Date(ad.end_date)
    };
  });
  
  const topPerformingAds = [...adRevenues]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">₹{Math.round(estimatedRevenue).toLocaleString()}</div>
            <p className="text-muted-foreground">Estimated Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{activeAds}</div>
            <p className="text-muted-foreground">Active Campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{(activeAds / totalAds * 100).toFixed(0)}%</div>
            <p className="text-muted-foreground">Campaign Activity Rate</p>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Top Performing Ads</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Impressions</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topPerformingAds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No revenue data available
                </TableCell>
              </TableRow>
            ) : (
              topPerformingAds.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium">{ad.title}</TableCell>
                  <TableCell>{ad.type}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(ad.startDate, { addSuffix: true })}
                  </TableCell>
                  <TableCell>{ad.reach?.toLocaleString() || 0}</TableCell>
                  <TableCell>{ad.clicks?.toLocaleString() || 0}</TableCell>
                  <TableCell className="font-medium">
                    ₹{Math.round(ad.revenue).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
