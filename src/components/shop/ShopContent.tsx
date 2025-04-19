
import React from "react";
import { ShopByCategory } from "@/components/shop/sections/ShopByCategory";
import { SponsoredProducts } from "@/components/shop/sections/SponsoredProducts";
import { SuggestedProducts } from "@/components/shop/sections/SuggestedProducts";
import { TrendingSection } from "@/components/shop/sections/TrendingSection";

export const ShopContent = () => {
  return (
    <div className="space-y-6">
      <ShopByCategory />
      <TrendingSection />
      <SponsoredProducts />
      <SuggestedProducts />
    </div>
  );
};
