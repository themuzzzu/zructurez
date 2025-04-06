
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export const SearchHero = () => {
  const navigate = useNavigate();
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const {
    query,
    setQuery,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    applySuggestion,
    isLoading
  } = useSearch({ suggestionsEnabled: true });

  // Featured searches for quick access
  const featuredSearches = [
    "Electronics", "Home Decor", "Fashion", "Books", "Sports"
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    applySuggestion(suggestion);
    navigate(`/search?q=${encodeURIComponent(suggestion.term)}`);
  };

  const handleFeaturedSearch = (term: string) => {
    setQuery(term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  // Handle clicks outside of the suggestions dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowSuggestions]);

  return (
    <div className="relative w-full bg-gradient-to-r from-zinc-900 to-zinc-800 text-white">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="w-full px-4 py-12 md:py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-6">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            Find Local Businesses & Services
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-zinc-200"
          >
            Discover the best local businesses, services, and deals around you
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <form onSubmit={handleSearch} className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-2 flex flex-col md:flex-row relative">
            <div className="relative flex-1 mb-2 md:mb-0 md:mr-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search businesses, services, products..."
                className="w-full pl-10 pr-4 py-3 rounded-md border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-800 dark:focus:ring-zinc-300 text-zinc-800 dark:text-zinc-200 dark:bg-zinc-800"
              />
              
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div 
                    ref={suggestionsRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-zinc-800 rounded-md shadow-lg z-50 border border-zinc-200 dark:border-zinc-700"
                  >
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer text-zinc-800 dark:text-zinc-200 text-left flex items-center"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <Search className="h-4 w-4 mr-2 text-zinc-400" />
                        {suggestion.term}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Button
              type="submit"
              className="bg-zinc-900 text-white px-6 py-3 rounded-md hover:bg-zinc-700 transition-colors flex-shrink-0"
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>

          {/* Featured searches */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {featuredSearches.map((term, index) => (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                key={term}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-sm flex items-center transition-colors"
                onClick={() => handleFeaturedSearch(term)}
              >
                <Sparkles className="h-3 w-3 mr-1.5" />
                {term}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
