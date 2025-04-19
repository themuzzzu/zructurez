
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ProductRankings = () => {
  const navigate = useNavigate();
  
  const topProducts = [
    { id: 1, name: "Wireless Earbuds", rating: 4.9, category: "Electronics" },
    { id: 2, name: "Organic Coffee Beans", rating: 4.8, category: "Food" },
    { id: 3, name: "Fitness Tracker", rating: 4.7, category: "Wearables" },
  ];
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Top Rated Products
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/marketplace/rankings')}
          className="text-sm text-muted-foreground hover:text-primary"
        >
          View All <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {topProducts.map(product => (
            <div 
              key={product.id}
              className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div>
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-xs text-muted-foreground">{product.category}</p>
              </div>
              <div className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                ⭐ {product.rating}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductRankings;
