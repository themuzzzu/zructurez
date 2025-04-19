
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { Layout } from "@/components/layout/Layout";
import { CategoryHeader } from "@/components/marketplace/CategoryHeader";
import { EmptySearchResults } from "@/components/marketplace/EmptySearchResults";

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryName, setCategoryName] = useState<string>(categorySlug || "Category");
  const [layout, setLayout] = useState<"grid4x4" | "grid3x3" | "grid2x2" | "list">("grid3x3");
  const [searchQuery, setSearchQuery] = useState("");

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
            <div className="bg-muted/30 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Filter Options</h2>
              <p className="text-muted-foreground text-sm">
                Filter options will be added here
              </p>
            </div>
          </div>

          <div className="md:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">Loading products...</div>
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
