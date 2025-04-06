import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { ProductGrid } from "@/components/products/ProductsGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCardSkeleton } from "@/components/ShoppingCardSkeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Services = () => {
  const [gridLayout, setGridLayout] = useState<GridLayoutType>("grid4x4");

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*');

      if (error) {
        console.error('Error fetching services:', error);
        return [];
      }

      return data || [];
    },
  });

  useEffect(() => {
    const savedLayout = localStorage.getItem('serviceGridLayout') as GridLayoutType | null;
    if (savedLayout && ["grid2x2", "grid3x3", "grid4x4", "list", "grid1x1", "single"].includes(savedLayout)) {
      setGridLayout(savedLayout);
    }
  }, []);

  const handleLayoutChange = (newLayout: GridLayoutType) => {
    setGridLayout(newLayout);
    localStorage.setItem('serviceGridLayout', newLayout);
  };

  const getGridClasses = () => {
    switch (gridLayout) {
      case "grid4x4":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      case "grid2x2":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2";
      case "grid3x3":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3";
      case "grid1x1":
      case "list":
      case "single":
      default:
        return "grid-cols-1";
  }
};

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Our Services</h1>

        {isLoading ? (
          <div className={`grid ${getGridClasses()} gap-4`}>
            {Array(6).fill(null).map((_, i) => (
              <ShoppingCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500">Error loading services.</div>
        ) : (
          <>
            {/* <div className="flex justify-end mb-4">
              <select
                value={gridLayout}
                onChange={(e) => handleLayoutChange(e.target.value as GridLayoutType)}
                className="border rounded px-4 py-2"
              >
                <option value="grid2x2">Grid 2x2</option>
                <option value="grid3x3">Grid 3x3</option>
                <option value="grid4x4">Grid 4x4</option>
                <option value="list">List View</option>
              </select>
            </div> */}
            <ProductGrid
              products={products}
              layout={gridLayout}
              onLayoutChange={handleLayoutChange}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Services;
