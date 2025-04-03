
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, ShoppingCart, MessageSquare, Users } from "lucide-react";

interface CategoryStatsProps {
  category: {
    name: string;
    totalProducts?: number;
    totalViews?: number;
    totalSales?: number;
    conversations?: number;
    sellers?: number;
  };
}

export const CategoryStats: React.FC<CategoryStatsProps> = ({ category }) => {
  const { name, totalProducts = 0, totalViews = 0, totalSales = 0, conversations = 0, sellers = 0 } = category;
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{name}</h1>
        <Badge variant="outline" className="text-xs">
          {totalProducts} Products
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <Eye className="h-5 w-5 text-primary mr-2" />
            <div>
              <div className="text-sm text-muted-foreground">Total Views</div>
              <div className="text-lg font-semibold">{totalViews.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <ShoppingCart className="h-5 w-5 text-primary mr-2" />
            <div>
              <div className="text-sm text-muted-foreground">Total Sales</div>
              <div className="text-lg font-semibold">{totalSales.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <MessageSquare className="h-5 w-5 text-primary mr-2" />
            <div>
              <div className="text-sm text-muted-foreground">Conversations</div>
              <div className="text-lg font-semibold">{conversations.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <Users className="h-5 w-5 text-primary mr-2" />
            <div>
              <div className="text-sm text-muted-foreground">Sellers</div>
              <div className="text-lg font-semibold">{sellers.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
