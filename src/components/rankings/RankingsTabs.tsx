
import { useState } from "react";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface RankingsTabsProps {
  type: "products" | "services" | "businesses";
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
}

export const RankingsTabs = ({ type, items, renderItem }: RankingsTabsProps) => {
  const [activeTab, setActiveTab] = useState("viewed");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold">Rankings</h2>
      </div>

      <Tabs defaultValue="viewed" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="viewed" className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>Most Viewed</span>
          </TabsTrigger>
          
          {type === "products" && (
            <>
              <TabsTrigger value="wishlisted" className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>Most Wishlisted</span>
              </TabsTrigger>
              <TabsTrigger value="selling" className="flex items-center gap-1">
                <ShoppingBag className="h-4 w-4" />
                <span>Top Selling</span>
              </TabsTrigger>
            </>
          )}
          
          {(type === "services" || type === "businesses") && (
            <TabsTrigger value="rated" className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>Top Rated</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="viewed" className="space-y-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, index) => (
              <div key={item.id} className="relative">
                {renderRankBadge(index)}
                {renderItem(item, index)}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="wishlisted" className="space-y-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, index) => (
              <div key={item.id} className="relative">
                {renderRankBadge(index)}
                {renderItem(item, index)}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="selling" className="space-y-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, index) => (
              <div key={item.id} className="relative">
                {renderRankBadge(index)}
                {renderItem(item, index)}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rated" className="space-y-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, index) => (
              <div key={item.id} className="relative">
                {renderRankBadge(index)}
                {renderItem(item, index)}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to render rank badges
const renderRankBadge = (index: number) => {
  // Different badge styles based on ranking
  if (index === 0) {
    return (
      <Badge className="absolute top-2 left-2 z-10 bg-yellow-500 font-bold">
        <Star className="h-3 w-3 mr-1" fill="white" /> Top Rated
      </Badge>
    );
  } else if (index === 1) {
    return (
      <Badge className="absolute top-2 left-2 z-10 bg-slate-400 font-bold">
        🥈 Runner Up
      </Badge>
    );
  } else if (index === 2) {
    return (
      <Badge className="absolute top-2 left-2 z-10 bg-amber-700 font-bold">
        🥉 3rd Place
      </Badge>
    );
  } else if (index < 10) {
    return (
      <Badge className="absolute top-2 left-2 z-10 bg-blue-500 font-bold">
        <Star className="h-3 w-3 mr-1" /> Top 10
      </Badge>
    );
  }
  return null;
};
