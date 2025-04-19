
import React from "react";
import { ShopByCategory } from "./sections/ShopByCategory";
import { SponsoredProducts } from "./sections/SponsoredProducts";
import { SuggestedProducts } from "./sections/SuggestedProducts";
import { TrendingSection } from "./sections/TrendingSection";

export const ShopContent = () => {
  return (
    <div className="space-y-6">
      <ShopByCategory />
      <SponsoredProducts />
      <SuggestedProducts />
      <TrendingSection />
    </div>
  );
};
