
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShopByCategory } from "./ShopByCategory";
import { CategorySection } from "./CategorySection";

export const MarketplaceContent = () => {
  const navigate = useNavigate();

  return (
    <>
      <ShopByCategory />
      <CategorySection onCategorySelect={(category) => navigate(`/marketplace/category/${category}`)} />
    </>
  );
};
