
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, BarChart, LineChart } from "lucide-react";
import { toast } from "sonner";

export const UpgradeAIFeaturesCard = () => {
  const handleUpgrade = () => {
    toast.success("You'll be redirected to the upgrade page");
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center mb-2">
          <Sparkles className="h-5 w-5 mr-2" />
          <CardTitle>AI Premium Analytics</CardTitle>
        </div>
        <CardDescription className="text-zinc-100">
          Unlock advanced AI insights to grow your business
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <TrendingUp className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Smart Pricing Optimization</p>
              <p className="text-sm text-muted-foreground">
                AI-powered pricing suggestions to maximize revenue based on market demand
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <BarChart className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Advanced Ad Performance</p>
              <p className="text-sm text-muted-foreground">
                Discover optimal bidding strategies and best times to advertise
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <LineChart className="h-5 w-5 text-purple-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Predictive Inventory Management</p>
              <p className="text-sm text-muted-foreground">
                Get smart restock alerts before you run out of inventory
              </p>
            </div>
          </div>
        </div>
        
        <Button 
          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={handleUpgrade}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Upgrade Now
        </Button>
      </CardContent>
    </Card>
  );
};
