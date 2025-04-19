
import React from "react";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ImageFallback } from "@/components/ui/image-fallback";

const tabs = [
  { id: "most-viewed", label: "Most Viewed", icon: <Eye className="w-4 h-4" /> },
  { id: "most-wishlisted", label: "Most Wishlisted", icon: <Heart className="w-4 h-4" /> },
  { id: "top-selling", label: "Top Selling", icon: <ShoppingBag className="w-4 h-4" /> },
];

interface Product {
  id: number;
  brand: string;
  image: string;
  views?: number;
  price: number;
}

const sampleProducts: Product[] = [
  {
    id: 1,
    brand: "Brand",
    image: "/placeholders/image-placeholder.jpg",
    views: 22,
    price: 7250
  },
  {
    id: 2,
    brand: "Brand",
    image: "/placeholders/image-placeholder.jpg",
    views: 10,
    price: 799
  },
  {
    id: 3,
    brand: "Brand",
    image: "/placeholders/image-placeholder.jpg",
    views: 2,
    price: 14299
  },
  {
    id: 4,
    brand: "Brand",
    image: "/placeholders/image-placeholder.jpg",
    views: 1,
    price: 7499
  }
];

export const ProductRankings = () => {
  const [activeTab, setActiveTab] = React.useState("most-viewed");

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Product Rankings</h2>
      
      {/* Ranking Tabs */}
      <div className="space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "w-full flex items-center gap-2 px-4 py-3 rounded-lg text-left text-base font-medium transition-colors",
              activeTab === tab.id 
                ? "bg-[#1e3a8a] text-white" 
                : "bg-[#1b2430] text-gray-300 hover:bg-[#1e3a8a]/80"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-4 gap-4">
        {sampleProducts.map((product) => (
          <div key={product.id} className="relative group">
            <div className="absolute top-2 left-2 bg-black/80 text-white px-2 py-0.5 rounded text-sm">
              {product.id}
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg bg-[#1b2430]">
              <ImageFallback
                src={product.image}
                alt={product.brand}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <button className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70">
                <Heart className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="mt-2 space-y-1 text-white">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{product.brand}</span>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Eye className="w-3 h-3" />
                  <span>{product.views} views</span>
                </div>
              </div>
              <div className="text-sm font-semibold">₹{product.price.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
