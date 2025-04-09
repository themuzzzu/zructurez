
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { Heading } from "@/components/ui/heading";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/common/Spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const UnifiedHome = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleSearch = () => {
    navigate(`/marketplace?search=${searchTerm}`);
  };

  return (
    <>
      <div className="relative bg-primary text-primary-foreground py-24 px-6 mb-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Find What You Need</h1>
          <p className="text-xl mb-8">Discover products and services in your area</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <Input 
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white text-foreground"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Heading className="mb-6">Browse by Category</Heading>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          {["Electronics", "Fashion", "Home", "Beauty", "Sports", "Toys"].map((category) => (
            <Button 
              key={category} 
              variant="outline" 
              className="h-24 flex flex-col gap-2"
              onClick={() => navigate(`/marketplace?category=${category}`)}
            >
              <span>{category}</span>
            </Button>
          ))}
        </div>

        <Heading className="mb-6">Featured Products</Heading>
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
