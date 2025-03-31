
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingSection } from "@/components/ShoppingSection";
import { GridLayoutType } from "@/components/products/types/ProductTypes";

interface CategoryTabContentProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  showDiscounted: boolean;
  setShowDiscounted: (value: boolean) => void;
  showUsed: boolean;
  setShowUsed: (value: boolean) => void;
  showBranded: boolean;
  setShowBranded: (value: boolean) => void;
  sortOption: string;
  setSortOption: (value: string) => void;
  priceRange: string;
  setPriceRange: (value: string) => void;
  resetFilters: () => void;
  gridLayout: GridLayoutType;
}

// Sample categories data
const categories = [
  { id: "electronics", name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZWxlY3Ryb25pY3N8ZW58MHx8MHx8fDA%3D" },
  { id: "clothing", name: "Clothing", image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNsb3RoaW5nfGVufDB8fDB8fHww" },
  { id: "books", name: "Books", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3N8ZW58MHx8MHx8fDA%3D" },
  { id: "home", name: "Home", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9tZSUyMGRlY29yfGVufDB8fDB8fHww" },
  { id: "beauty", name: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXR5fGVufDB8fDB8fHww" },
  { id: "sports", name: "Sports", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3BvcnRzfGVufDB8fDB8fHww" },
  { id: "toys", name: "Toys", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dG95c3xlbnwwfHwwfHx8MA%3D%3D" },
  { id: "food", name: "Food", image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D" },
];

export const CategoryTabContent = ({
  selectedCategory,
  setSelectedCategory,
  showDiscounted,
  setShowDiscounted,
  showUsed,
  setShowUsed,
  showBranded,
  setShowBranded,
  sortOption,
  setSortOption,
  priceRange,
  setPriceRange,
  resetFilters,
  gridLayout
}: CategoryTabContentProps) => {
  if (selectedCategory === "all") {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Browse By Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className="overflow-hidden cursor-pointer hover:shadow-md transition-all"
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="aspect-video relative">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <h3 className="text-white font-medium p-3">{category.name}</h3>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const category = categories.find(cat => cat.id === selectedCategory);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">{category?.name}</h2>
        <Button variant="outline" onClick={() => setSelectedCategory("all")}>
          All Categories
        </Button>
      </div>
      
      <ShoppingSection
        selectedCategory={selectedCategory}
        showDiscounted={showDiscounted}
        showUsed={showUsed}
        showBranded={showBranded}
        sortOption={sortOption}
        priceRange={priceRange}
        gridLayout={gridLayout}
      />
    </div>
  );
};
