
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { Button } from "@/components/ui/button";

export const SearchHero = () => {
  const navigate = useNavigate();
  
  const {
    query,
    setQuery,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    applySuggestion
  } = useSearch({ suggestionsEnabled: true });

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

  return (
    <div className="relative w-full bg-zinc-900 text-white">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="w-full px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Find Local Businesses & Services
          </h1>
          <p className="text-lg md:text-xl text-zinc-200">
            Discover the best local businesses, services, and deals around you
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-2 flex flex-col md:flex-row">
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
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-zinc-800 rounded-md shadow-lg z-20 border border-zinc-200 dark:border-zinc-700">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer text-zinc-800 dark:text-zinc-200 text-left"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.term}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button
              type="submit"
              className="bg-zinc-900 text-white px-6 py-3 rounded-md hover:bg-zinc-700 transition-colors flex-shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
