
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { EnhancedShoppingSection } from "@/components/EnhancedShoppingSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(query);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 pb-16 max-w-7xl">
        <div className="flex items-center justify-between mb-6 mt-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl md:text-2xl font-bold">
              {searchTerm ? `Results for "${searchTerm}"` : "Search Results"}
            </h1>
          </div>
          
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
        
        {/* Enhanced shopping section with tabbed interface for products, businesses and services */}
        <EnhancedShoppingSection 
          searchQuery={searchTerm} 
          showFilters={showFilters}
        />
      </main>
    </div>
  );
}
