
import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, parseISO, differenceInDays } from "date-fns";

interface AdPerformanceTableProps {
  adData: any[];
  isLoading: boolean;
}

export const AdPerformanceTable = ({ 
  adData, 
  isLoading 
}: AdPerformanceTableProps) => {
  // Calculate ad performance metrics
  const adPerformance = useMemo(() => {
    if (!adData.length) return [];
    
    return adData.map(ad => {
      const impressions = ad.reach || 0;
      const clicks = ad.clicks || 0;
      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      
      // Calculate cost per click (CPC) and return on ad spend (ROAS)
      const daysRunning = differenceInDays(
        new Date(),
        parseISO(ad.start_date)
      ) + 1;
      
      const dailyBudget = ad.budget / daysRunning;
      const cpc = clicks > 0 ? dailyBudget / clicks : 0;
      
      // Simulated conversion rate and average order value for ROAS calculation
      const conversionRate = 0.02 + (Math.random() * 0.03); // 2-5% conversion rate
      const avgOrderValue = 250 + (Math.random() * 750); // ₹250-1000 avg order
      
      const estimatedRevenue = clicks * conversionRate * avgOrderValue;
      const roas = dailyBudget > 0 ? estimatedRevenue / dailyBudget : 0;
      
      // AI recommendation based on performance
      let recommendation;
      let recommendationColor;
      
      if (ctr < 1) {
        recommendation = "Improve creative";
        recommendationColor = "text-red-500";
      } else if (ctr >= 1 && ctr < 3) {
        recommendation = "Refine targeting";
        recommendationColor = "text-amber-500";
      } else if (cpc > 20) {
        recommendation = "Optimize bidding";
        recommendationColor = "text-amber-500";
      } else if (roas < 1) {
        recommendation = "Pause campaign";
        recommendationColor = "text-red-500";
      } else if (roas > 5) {
        recommendation = "Increase budget";
        recommendationColor = "text-green-500";
      } else {
        recommendation = "Performing well";
        recommendationColor = "text-green-500";
      }
      
      return {
        ...ad,
        impressions,
        clicks,
        ctr,
        cpc,
        roas,
        recommendation,
        recommendationColor
      };
    }).sort((a, b) => b.roas - a.roas);
  }, [adData]);
  
  if (isLoading) {
    return <p>Loading ad performance data...</p>;
  }
  
  if (adPerformance.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No active ad campaigns found</p>
        <Button>Create Ad Campaign</Button>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Campaign</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Impressions</TableHead>
          <TableHead>Clicks</TableHead>
          <TableHead>CTR</TableHead>
          <TableHead>Avg. CPC</TableHead>
          <TableHead>Est. ROAS</TableHead>
          <TableHead>AI Recommendation</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {adPerformance.map(ad => (
          <TableRow key={ad.id}>
            <TableCell className="font-medium">{ad.title}</TableCell>
            <TableCell>
              <Badge variant="outline">{ad.status}</Badge>
            </TableCell>
            <TableCell>{ad.impressions.toLocaleString()}</TableCell>
            <TableCell>{ad.clicks.toLocaleString()}</TableCell>
            <TableCell>{ad.ctr.toFixed(2)}%</TableCell>
            <TableCell>₹{ad.cpc.toFixed(2)}</TableCell>
            <TableCell>{ad.roas.toFixed(1)}x</TableCell>
            <TableCell>
              <span className={ad.recommendationColor}>{ad.recommendation}</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
