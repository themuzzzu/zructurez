
import React, { useState } from 'react';
import { CategoryIconGrid } from '@/components/marketplace/CategoryIconGrid';
import { CategoryNavigationBar } from '@/components/marketplace/CategoryNavigationBar';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon, Filter, ShoppingBag } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useQuery } from '@tanstack/react-query';
import { getMockSearchResults } from '@/lib/supabase';

export const MarketplaceContent = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Get mock products for now (can be replaced with real API call later)
  const { data: products = [] } = useQuery({
    queryKey: ['marketplace-products', selectedCategory],
    queryFn: () => getMockSearchResults(selectedCategory === "all" ? "product" : selectedCategory)
  });

  const categories = ["All", "Electronics", "Fashion", "Home", "Beauty", "Sports", "Books", "Toys", "Garden"];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category.toLowerCase());
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
        <div className="relative z-10 max-w-xl">
          <h1 className="text-3xl font-bold mb-2">Welcome to our Marketplace</h1>
          <p className="text-lg opacity-90 mb-6">
            Discover amazing products from local sellers and global brands
          </p>
          
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full py-3 px-4 pr-12 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 p-2 rounded-md"
              >
                <SearchIcon className="h-5 w-5 text-white" />
              </button>
            </div>
          </form>
        </div>
        <div className="absolute top-0 right-0 opacity-20">
          <ShoppingBag className="h-64 w-64" />
        </div>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="browse" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="browse">Browse Categories</TabsTrigger>
          <TabsTrigger value="featured">Featured Products</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <Card className="p-4">
            <CardContent className="p-0">
              <h2 className="text-xl font-medium mb-4">Categories</h2>
              <CategoryIconGrid onCategorySelect={handleCategorySelect} />
            </CardContent>
          </Card>

          {/* Category Navigation */}
          <div className="sticky top-16 z-10 bg-background pt-2 pb-2">
            <CategoryNavigationBar 
              categories={categories} 
              onCategorySelect={handleCategorySelect} 
              activeCategory={selectedCategory === "all" ? "All" : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} 
            />
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product: any) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative">
                  <AspectRatio ratio={1/1}>
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  {product.isDiscounted && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                      {product.discount_percentage}% OFF
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm line-clamp-1">{product.title}</h3>
                  <div className="flex items-baseline justify-between mt-1">
                    <div>
                      <span className="font-bold">₹{product.price}</span>
                      {product.isDiscounted && (
                        <span className="text-xs text-muted-foreground line-through ml-1">
                          ₹{product.original_price}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{product.brand}</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="featured" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-red-500 p-6 text-white">
                <h3 className="text-xl font-bold mb-1">Featured Collection</h3>
                <p className="mb-4 opacity-90">Summer essentials at amazing prices</p>
                <Button variant="secondary">Explore Now</Button>
              </div>
            </Card>
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                <h3 className="text-xl font-bold mb-1">New Arrivals</h3>
                <p className="mb-4 opacity-90">Just landed - check out what's new</p>
                <Button variant="secondary">See Collection</Button>
              </div>
            </Card>
          </div>

          {/* Featured Products */}
          <h2 className="text-xl font-medium mb-4">Featured Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.slice(0, 8).map((product: any) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative">
                  <AspectRatio ratio={1/1}>
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  {product.isSponsored && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                      Sponsored
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm line-clamp-1">{product.title}</h3>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-bold">₹{product.price}</span>
                    <div className="text-xs text-muted-foreground">{product.provider}</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
