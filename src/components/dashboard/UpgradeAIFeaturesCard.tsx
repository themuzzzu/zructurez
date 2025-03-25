
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, BarChart, LineChart, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UpgradeAIFeaturesCard = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  
  // Use intersection observer for performance optimization
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Unobserve after becoming visible to save resources
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    );
    
    const cardElement = document.getElementById('ai-premium-card');
    if (cardElement) {
      observer.observe(cardElement);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);

  const handleUpgrade = () => {
    toast.success("You'll be redirected to the upgrade page");
    // Demo: Navigate to a performance dashboard to showcase analytics
    navigate("/marketplace");
  };

  return (
    <Card 
      id="ai-premium-card"
      className={`overflow-hidden h-full flex flex-col transform transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
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
          className="mt-6 w-full group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={handleUpgrade}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Upgrade Now
          <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default UpgradeAIFeaturesCard;
