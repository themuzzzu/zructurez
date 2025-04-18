
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function SearchHero() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&from=home`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto pt-4 sm:pt-8 pb-6">
      <div className="text-center mb-6 animate-in fade-in slide-in-from-bottom duration-500">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          Find Local Services & Products
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Discover trusted businesses and services in your area
        </p>
      </div>
      
      <form onSubmit={handleSearch} className="relative animate-in fade-in slide-in-from-bottom duration-700 delay-200">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for services, products, or businesses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-24 h-12 text-base bg-background/60 backdrop-blur-sm border-2 focus:border-primary"
        />
        <Button 
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9"
          type="submit"
          size="sm"
        >
          Search
        </Button>
      </form>
    </div>
  );
}
