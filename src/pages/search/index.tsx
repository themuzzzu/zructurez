
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchBar } from "@/components/search/SearchBar";
import { Navbar } from "@/components/Navbar";
import { ShoppingSection } from "@/components/ShoppingSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { trackEntityView } from "@/utils/viewsTracking";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(query);

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(newQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 pb-16 max-w-7xl">
        <div className="flex items-center mb-4 mt-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Search Results</h1>
        </div>
        
        {/* Redesigned search bar in black and white */}
        <div className="mb-6">
          <SearchBar 
            autoFocus={false}
            placeholder="Search products, businesses, services..."
            onSearch={handleSearch}
            showVoiceSearch={true}
            className="max-w-full"
          />
        </div>
        
        {/* Shopping section with products */}
        <ShoppingSection searchQuery={searchTerm} />
      </main>
    </div>
  );
}
