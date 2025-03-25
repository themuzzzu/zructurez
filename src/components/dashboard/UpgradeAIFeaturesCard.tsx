
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles } from "lucide-react";

export const UpgradeAIFeaturesCard = () => {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-primary mr-2" />
            <h3 className="text-lg font-semibold">AI Premium Analytics</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Unlock advanced AI features to boost your business performance
          </p>
          
          <div className="space-y-2">
            <div className="flex items-start">
              <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
              <span className="text-sm">Smart inventory forecasting with 98% accuracy</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
              <span className="text-sm">Dynamic pricing optimization for maximum profits</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
              <span className="text-sm">AI-driven ad timing suggestions for best ROI</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
              <span className="text-sm">Customer behavior analysis and predictive trends</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Sparkles className="h-4 w-4 mr-2" />
          Upgrade to AI Premium
        </Button>
      </CardFooter>
    </Card>
  );
};
