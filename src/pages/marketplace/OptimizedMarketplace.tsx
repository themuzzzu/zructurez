
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketplaceHeader } from "./MarketplaceHeader";
import { BrowseTabContent } from "./BrowseTabContent";
import { CategoryTabContent } from "./CategoryTabContent";
import { SearchTabContent } from "./SearchTabContent";
import { BannerCarousel } from "@/components/marketplace/BannerCarousel";
import { MarketplaceHero } from "@/components/marketplace/MarketplaceHero";

const OptimizedMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("browse");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab("search");
  };

  const handleCategorySelect = (category: string) => {
    setActiveTab("category");
  };

  const handleSearchSelect = (term: string) => {
    setSearchQuery(term);
    setActiveTab("search");
  };

  return (
    <div className="container px-4 mx-auto max-w-screen-xl py-4 pb-16">
      {/* Display the banner carousel at the top of the page */}
      <div className="mb-8">
        <BannerCarousel />
      </div>

      <MarketplaceHeader onSearch={handleSearch} />

      <Tabs
        defaultValue="browse"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mt-6"
      >
        <TabsList className="w-full max-w-md grid grid-cols-3 mb-6">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="category">Categories</TabsTrigger>
          <TabsTrigger value="search">Search Results</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="mt-0">
          <BrowseTabContent 
            handleCategorySelect={handleCategorySelect}
            handleSearchSelect={handleSearchSelect}
          />
        </TabsContent>

        <TabsContent value="category" className="mt-0">
          <CategoryTabContent />
        </TabsContent>

        <TabsContent value="search" className="mt-0">
          <SearchTabContent query={searchQuery} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OptimizedMarketplace;
