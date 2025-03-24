
import { useState } from "react";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, Smartphone, Laptop, Home, 
  Shirt, Gift, Headphones, Car, Baby, Coffee
} from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface MarketplaceHeroProps {
  onCategorySelect: (category: string) => void;
  onSearch: (term: string) => void;
}

export const MarketplaceHero = ({ onCategorySelect, onSearch }: MarketplaceHeroProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const categoryShortcuts = [
    { name: "Electronics", icon: <Smartphone size={24} />, color: "bg-blue-100 text-blue-600" },
    { name: "Computers", icon: <Laptop size={24} />, color: "bg-purple-100 text-purple-600" },
    { name: "Fashion", icon: <Shirt size={24} />, color: "bg-pink-100 text-pink-600" },
    { name: "Home", icon: <Home size={24} />, color: "bg-green-100 text-green-600" },
    { name: "Gifts", icon: <Gift size={24} />, color: "bg-red-100 text-red-600" },
    { name: "Audio", icon: <Headphones size={24} />, color: "bg-yellow-100 text-yellow-600" },
    { name: "Automotive", icon: <Car size={24} />, color: "bg-slate-100 text-slate-600" },
    { name: "Baby", icon: <Baby size={24} />, color: "bg-indigo-100 text-indigo-600" },
    { name: "Kitchen", icon: <Coffee size={24} />, color: "bg-amber-100 text-amber-600" },
  ];

  return (
    <div className="my-4 rounded-xl overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 shadow-md">
      <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8 items-center">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Find Everything You Need in One Place
          </h1>
          <p className="text-blue-100 text-lg">
            Explore thousands of products from top brands and local businesses
          </p>
          
          <div className="flex mt-6 relative">
            <SearchInput
              placeholder="Search for products, brands and more..."
              value={searchTerm}
              onChange={setSearchTerm}
              className="w-full rounded-r-none shadow-lg"
            />
            <Button 
              onClick={handleSearch}
              className="rounded-l-none bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              Search
            </Button>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
            {categoryShortcuts.slice(0, 5).map((category, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white"
                onClick={() => onCategorySelect(category.name.toLowerCase())}
              >
                {category.icon}
                <span className="ml-1 hidden sm:inline">{category.name}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="hidden md:block">
          <img 
            src="https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNob3BwaW5nJTIwb25saW5lfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60" 
            alt="Marketplace Hero" 
            className="w-full h-64 object-cover rounded-xl shadow-lg"
          />
        </div>
      </div>
      
      <div className="bg-white dark:bg-zinc-800 p-4">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {categoryShortcuts.map((category, index) => (
              <CarouselItem key={index} className="md:basis-1/6 lg:basis-1/8">
                <div 
                  className="flex flex-col items-center gap-2 p-2 cursor-pointer"
                  onClick={() => onCategorySelect(category.name.toLowerCase())}
                >
                  <div className={`h-12 w-12 rounded-full ${category.color} flex items-center justify-center`}>
                    {category.icon}
                  </div>
                  <span className="text-xs font-medium">{category.name}</span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>
    </div>
  );
};
