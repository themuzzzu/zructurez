
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Percent, Clock, Star } from "lucide-react";

export const DealsTabContent = () => {
  const mockDeals = [
    {
      id: 1,
      title: "50% Off Electronics",
      description: "Limited time offer on all electronic items",
      discount: 50,
      validUntil: "2024-01-31",
      category: "Electronics"
    },
    {
      id: 2,
      title: "Buy 2 Get 1 Free",
      description: "Special offer on clothing items",
      discount: 33,
      validUntil: "2024-02-15",
      category: "Fashion"
    },
    {
      id: 3,
      title: "Early Bird Special",
      description: "30% off for first 100 customers",
      discount: 30,
      validUntil: "2024-01-25",
      category: "Services"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Special Deals & Offers</h2>
        <p className="text-muted-foreground">Don't miss out on these amazing deals!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDeals.map((deal) => (
          <Card key={deal.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="destructive" className="text-xs">
                  <Percent className="h-3 w-3 mr-1" />
                  {deal.discount}% OFF
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {deal.category}
                </Badge>
              </div>
              <CardTitle className="text-lg">{deal.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {deal.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Valid until {deal.validUntil}
                </div>
                <div className="flex items-center">
                  <Star className="h-3 w-3 mr-1 fill-current text-yellow-500" />
                  Featured
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          More deals are added regularly. Check back often!
        </p>
      </div>
    </div>
  );
};
