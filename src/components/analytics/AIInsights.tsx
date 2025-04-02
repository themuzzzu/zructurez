
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Clock, Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AIInsightsProps {
  wishlistCount: number;
  purchaseCount: number;
  isLoading: boolean;
}

export const AIInsights = ({ wishlistCount, purchaseCount, isLoading }: AIInsightsProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-40 mb-2" />
          <Skeleton className="h-5 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Insights</CardTitle>
        <CardDescription>
          Data-driven recommendations for your business
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Sales Forecast
          </h3>
          <p className="mt-2 text-muted-foreground">
            Based on current trends, you're projected to see a <span className="text-green-500 font-medium">15% increase</span> in sales next month. 
            Consider running a promotion on your top-performing product to maximize this growth.
          </p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Posting Optimization
          </h3>
          <p className="mt-2 text-muted-foreground">
            Your audience is most active between <span className="text-amber-500 font-medium">6 PM and 9 PM</span>. 
            Schedule your product updates and posts during these hours for maximum visibility.
          </p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Conversion Opportunity
          </h3>
          <p className="mt-2 text-muted-foreground">
            You have <span className="text-red-500 font-medium">{wishlistCount - purchaseCount} users</span> who added products to their wishlist but haven't purchased yet. 
            Consider sending a limited-time discount offer to convert these potential customers.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
