
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Eye, Heart, MessageCircle } from "lucide-react";

export const TrendingTabContent = () => {
  const trendingItems = [
    {
      id: 1,
      title: "Wireless Earbuds Pro",
      category: "Electronics",
      views: 1250,
      likes: 89,
      comments: 23,
      trending_score: 95,
      image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Vintage Coffee Shop",
      category: "Business",
      views: 890,
      likes: 156,
      comments: 34,
      trending_score: 88,
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Home Cleaning Service",
      category: "Services",
      views: 654,
      likes: 72,
      comments: 18,
      trending_score: 82,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop"
    },
    {
      id: 4,
      title: "Handmade Pottery",
      category: "Crafts",
      views: 432,
      likes: 98,
      comments: 27,
      trending_score: 76,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Trending Now
        </h2>
        <p className="text-muted-foreground">Most popular items this week</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {trendingItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
            <div className="relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-red-500 text-white">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {item.trending_score}
                </Badge>
              </div>
              <div className="absolute top-2 left-2">
                <Badge variant="outline" className="bg-white/90">
                  {item.category}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 line-clamp-1">{item.title}</h3>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {item.views}
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-3 w-3 mr-1" />
                    {item.likes}
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {item.comments}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          Trending items are updated every hour based on user engagement
        </p>
      </div>
    </div>
  );
};
