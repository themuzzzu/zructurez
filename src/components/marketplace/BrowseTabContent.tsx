
import { useState, useEffect } from "react";
import { ShoppingSection } from "@/components/ShoppingSection";
import { Categories } from "@/components/marketplace/Categories";
import { useNavigate, useLocation } from "react-router-dom";
import { SponsoredProducts } from "@/components/marketplace/SponsoredProducts";
import { TopDeals } from "@/components/marketplace/TopDeals";
import { TrendingProducts } from "@/components/marketplace/TrendingProducts";
import { PersonalizedRecommendations } from "@/components/marketplace/PersonalizedRecommendations";
import { FlashSale } from "@/components/marketplace/FlashSale";
import { CategoryFeatured } from "@/components/marketplace/CategoryFeatured";
import { CategoryNavigationBar } from "@/components/marketplace/CategoryNavigationBar";
import { MarketplaceBanner } from "@/components/marketplace/MarketplaceBanner";

interface BrowseTabContentProps {
  searchResults?: any[];
  searchTerm?: string;
  isSearching?: boolean;
  onCategorySelect?: (category: string) => void;
  onSearchSelect?: (term: string) => void;
}

export const BrowseTabContent = ({
  searchResults = [],
  searchTerm = "",
  isSearching = false,
  onCategorySelect,
  onSearchSelect
}: BrowseTabContentProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Parse URL query parameters to set initial category
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    
    if (category !== "all") {
      navigate(`/marketplace?category=${category}`);
    } else {
      navigate('/marketplace');
    }
    
    // Call the parent handler if provided
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };
  
  // Popular categories for featured sections
  const popularCategories = ["Electronics", "Fashion", "Home"];
  
  return (
    <div className="space-y-6">
      {/* Banner at the top */}
      <MarketplaceBanner />
      
      {/* Main Category Navigation Bar */}
      <div className="mb-6">
        <CategoryNavigationBar />
      </div>
      
      {/* Secondary Categories */}
      <div className="mb-6">
        <Categories 
          onCategorySelect={handleCategorySelect} 
          showAllCategories={true}
        />
      </div>
      
      {/* Sponsored Products */}
      <SponsoredProducts />
      
      {/* Top Deals */}
      <TopDeals />
      
      {/* Flash Sale */}
      <FlashSale />
      
      {/* Trending Products */}
      <TrendingProducts />
      
      {/* Personalized Recommendations */}
      <PersonalizedRecommendations />
      
      {/* Category Featured Products */}
      {popularCategories.map(category => (
        <CategoryFeatured key={category} categoryName={category} />
      ))}
      
      {/* Main Shopping Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6 px-1">All Products</h2>
        <ShoppingSection 
          searchQuery={searchTerm || ""}
          selectedCategory={selectedCategory === "all" ? "" : selectedCategory}
        />
      </div>
    </div>
  );
};
