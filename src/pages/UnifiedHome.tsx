import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/common/Spinner";
import { SearchBar } from "@/components/home/SearchBar";
import { LocalAreas } from "@/components/home/LocalAreas";

const UnifiedHome = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .limit(12);

        if (error) {
          console.error("Error fetching products:", error);
        }

        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (searchTerm: string) => {
    navigate(`/marketplace?search=${searchTerm}`);
  };

  return (
    <>
      <Hero />
      <SearchBar onSearch={handleSearch} />

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <SectionTitle title="Browse by Category" />
        <Categories />

        <SectionTitle title="Featured Products" />
        {loading ? (
          <div className="flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <ProductsGrid layout="grid3x3" products={products} />
        )}
      </div>
    </>
  );
};

export default UnifiedHome;
