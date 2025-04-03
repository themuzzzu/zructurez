
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CategoryStats } from "@/components/marketplace/CategoryStats";

export const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  
  // Get category details
  const { data: category, isLoading: isCategoryLoading } = useQuery({
    queryKey: ['category', categoryName],
    queryFn: async () => {
      // Since we don't have a categories table, we'll create a mock category object
      const categoryData = {
        name: categoryName || "Category",
        description: `Browse all products in the ${categoryName} category`,
        productCount: 0,
        image_url: "/placeholder.jpg"
      };
      
      // Get product count for this category
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category', categoryName);
        
      return {
        ...categoryData,
        productCount: count || 0
      };
    }
  });
  
  // Get subcategories for this category
  useEffect(() => {
    const fetchSubcategories = async () => {
      const { data } = await supabase
        .from('products')
        .select('subcategory')
        .eq('category', categoryName)
        .not('subcategory', 'is', null);
        
      if (data) {
        // Extract unique subcategories
        const uniqueSubcategories = [...new Set(data.map(item => item.subcategory))];
        setSubcategories(uniqueSubcategories as string[]);
      }
    };
    
    if (categoryName) {
      fetchSubcategories();
    }
  }, [categoryName]);
  
  if (isCategoryLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </Layout>
    );
  }
  
  // Prepare stats data for CategoryStats
  const statsData = {
    name: categoryName || "Category",
    totalProducts: category?.productCount || 0,
    totalViews: 0,
    totalSales: 0,
    conversations: 0,
    sellers: 0
  };
  
  return (
    <Layout>
      <div className="container py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Marketplace", href: "/marketplace" },
            { label: categoryName || "Category", href: "#" },
          ]}
        />
        
        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-bold mb-2">{category?.name}</h1>
          <p className="text-muted-foreground">{category?.description}</p>
        </div>
        
        {/* Subcategory filters */}
        {subcategories.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Subcategories</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button
                variant={selectedSubcategory === "" ? "default" : "outline"}
                onClick={() => setSelectedSubcategory("")}
              >
                All
              </Button>
              {subcategories.map((sub) => (
                <Button
                  key={sub}
                  variant={selectedSubcategory === sub ? "default" : "outline"}
                  onClick={() => setSelectedSubcategory(sub)}
                >
                  {sub}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}
        
        {/* Category Statistics */}
        <CategoryStats category={statsData} />
        
        {/* Products Grid */}
        <div className="mt-8">
          <ProductGrid 
            category={categoryName}
            subcategory={selectedSubcategory}
          />
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
