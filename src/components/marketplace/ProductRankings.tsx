import React from "react";
import { Heart, Eye, ShoppingBag } from "lucide-react";
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
  wishlistCount?: number;
  sales?: number;
  price: number;
}

const sampleProducts: Product[] = [
  {
    id: 1,
    brand: "Nike",
    image: "/placeholders/image-placeholder.jpg",
    views: 22,
    wishlistCount: 10,
    sales: 150,
    price: 7250
  },
  {
    id: 2,
    brand: "Adidas",
    image: "/placeholders/image-placeholder.jpg",
    views: 10,
    wishlistCount: 30,
    sales: 240,
    price: 799
  },
  {
    id: 3,
    brand: "Puma",
    image: "/placeholders/image-placeholder.jpg",
    views: 2,
    wishlistCount: 5,
    sales: 90,
    price: 14299
  },
  {
    id: 4,
    brand: "Reebok",
    image: "/placeholders/image-placeholder.jpg",
    views: 1,
    wishlistCount: 2,
    sales: 15,
    price: 7499
  }
];

export const ProductRankings = () => {
  const [activeTab, setActiveTab] = React.useState("most-viewed");

  const getSortedProducts = (): Product[] => {
    const products = [...sampleProducts];

    switch (activeTab) {
      case "most-viewed":
        return products.sort((a, b) => (b.views || 0) - (a.views || 0));
      case "most-wishlisted":
        return products.sort((a, b) => (b.wishlistCount || 0) - (a.wishlistCount || 0));
      case "top-selling":
        return products.sort((a, b) => (b.sales || 0) - (a.sales || 0));
      default:
        return products;
    }
  };

  const sortedProducts = getSortedProducts();

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedProducts.map((product, index) => (
          <div key={product.id} className="relative group">
            <div className="absolute top-2 left-2 bg-black/80 text-white px-2 py-0.5 rounded text-sm z-10">
              #{index + 1}
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
                  {activeTab === "most-viewed" && <><Eye className="w-3 h-3" /><span>{product.views} views</span></>}
                  {activeTab === "most-wishlisted" && <><Heart className="w-3 h-3" /><span>{product.wishlistCount} wishes</span></>}
                  {activeTab === "top-selling" && <><ShoppingBag className="w-3 h-3" /><span>{product.sales} sold</span></>}
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
