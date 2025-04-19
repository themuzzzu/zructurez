
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { CategorySection } from "@/components/marketplace/CategorySection";
import { ShopByCategory } from "@/components/marketplace/ShopByCategory";
import { useNavigate } from "react-router-dom";

const Marketplace = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Shop by Category Section */}
        <ShopByCategory />

        {/* Category Grid Section */}
        <CategorySection onCategorySelect={(category) => navigate(`/marketplace/category/${category}`)} />
      </div>
    </Layout>
  );
};

export default Marketplace;
