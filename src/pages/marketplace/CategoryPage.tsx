import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { Layout } from "@/components/layout/Layout";
import { CategoryHeader } from "@/components/marketplace/CategoryHeader";
import { CategorySidebar } from "@/components/marketplace/CategorySidebar";
import { EmptySearchResults } from "@/components/marketplace/EmptySearchResults";

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>("");
  const [layout, setLayout] = useState<"grid4x4" | "grid3x3" | "grid2x2" | "list">("grid3x3");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        // Replace this query with one that works with existing tables
        const { data, error } = await supabase
          .from('ad_categories')  // Use an existing table or handle the error gracefully
          .select('*')
          .eq('name', categorySlug);

        if (error) {
          console.error("Error fetching categories:", error);
          setIsLoading(false);
          return;
        }

        if (data && data.length > 0) {
          setCategoryName(data[0].name);
        } else {
          setCategoryName(categorySlug || "Category");
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (categorySlug) {
      fetchCategories();
    }
  }, [categorySlug]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('products')
          .select('*')
          .eq('category', categorySlug);

        if (searchQuery) {
          query = query.ilike('title', `%${searchQuery}%`);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching products:", error);
          setIsLoading(false);
          return;
        }

        setProducts(data || []);
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (categorySlug) {
      fetchProducts();
    }
  }, [categorySlug, searchQuery]);

  const handleLayoutChange = (newLayout: "grid4x4" | "grid3x3" | "grid2x2" | "list") => {
    setLayout(newLayout);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchQuery(searchTerm);
  };

  return (
    <Layout>
      <div className="container max-w-[1400px] py-6 px-4">
        <CategoryHeader
          categoryName={categoryName}
          onLayoutChange={handleLayoutChange}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <CategorySidebar />
          </div>

          <div className="md:col-span-3">
            {isLoading ? (
              <div>Loading products...</div>
            ) : products.length > 0 ? (
              <ProductsGrid
                products={products}
                layout={layout}
                isLoading={isLoading}
                searchQuery={searchQuery}
              />
            ) : (
              <EmptySearchResults searchTerm={searchQuery} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
