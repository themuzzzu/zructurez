
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  getProductRankings, 
  getTopSellingProducts, 
  getMostWishlistedProducts, 
  RankingType 
} from "@/services/rankingService";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, ShoppingCart, Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/productUtils";

export const ProductRankings = () => {
  const [rankingType, setRankingType] = useState<RankingType>("views");
  const navigate = useNavigate();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['product-rankings', rankingType],
    queryFn: () => {
      if (rankingType === "views") {
        return getProductRankings("views", 20);
      } else if (rankingType === "wishlist") {
        return getMostWishlistedProducts(20);
      } else {
        return getTopSellingProducts(20);
      }
    }
  });
  
  const navigateToProduct = (id: string) => {
    navigate(`/products/${id}`);
  };
  
  const getBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500/90 text-white";
    if (rank === 2) return "bg-gray-400/90 text-white";
    if (rank === 3) return "bg-amber-600/90 text-white";
    if (rank <= 10) return "bg-blue-500/90 text-white";
    return "bg-primary/90 text-white";
  };
  
  const getScoreIcon = () => {
    if (rankingType === "views") return <Eye className="h-4 w-4" />;
    if (rankingType === "wishlist") return <Heart className="h-4 w-4" />;
    return <ShoppingCart className="h-4 w-4" />;
  };
  
  const getScoreLabel = () => {
    if (rankingType === "views") return "Views";
    if (rankingType === "wishlist") return "Wishlist";
    return "Sales";
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Tabs defaultValue="views">
          <TabsList>
            <TabsTrigger value="views">Most Viewed</TabsTrigger>
            <TabsTrigger value="wishlist">Most Wishlisted</TabsTrigger>
            <TabsTrigger value="sales">Top Selling</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex p-4">
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <div className="ml-4 flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="views" 
        value={rankingType} 
        onValueChange={(value) => setRankingType(value as RankingType)}
      >
        <TabsList>
          <TabsTrigger value="views" className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>Most Viewed</span>
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>Most Wishlisted</span>
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-1">
            <ShoppingCart className="h-4 w-4" />
            <span>Top Selling</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products?.map((product, index) => (
          <Card 
            key={product.id} 
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigateToProduct(product.id)}
          >
            <CardContent className="p-0">
              <div className="flex p-4">
                <div className="relative">
                  <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title || "Product"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                        <ShoppingCart className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  {product.rank && (
                    <div className="absolute -top-2 -left-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                      {product.rank}
                    </div>
                  )}
                </div>
                
                <div className="ml-4 flex-1">
                  <h3 className="font-medium line-clamp-1">{product.title}</h3>
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    <span>{product.category}</span>
                  </div>
                  <p className="text-sm mt-1 font-medium">
                    {formatPrice(product.price || 0)}
                  </p>
                </div>
                
                <div className="flex flex-col items-end justify-between">
                  {product.badge && (
                    <Badge className={getBadgeColor(product.rank || 0)}>
                      {product.badge}
                    </Badge>
                  )}
                  <div className="flex items-center mt-2">
                    {getScoreIcon()}
                    <span className="text-sm font-medium ml-1">
                      {product.score?.toLocaleString() || 0} {getScoreLabel()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
