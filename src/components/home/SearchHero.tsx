
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";

export const SearchHero = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("Bangalore");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  
  const {
    query,
    setQuery,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    applySuggestion
  } = useSearch({ suggestionsEnabled: true });

  const popularLocations = [
    "Bangalore", "Hyderabad", "Chennai", "Mumbai", "Delhi"
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    applySuggestion(suggestion);
    navigate(`/search?q=${encodeURIComponent(suggestion.term)}&location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="relative w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Find Local Businesses & Services
          </h1>
          <p className="text-lg md:text-xl text-blue-100">
            Discover the best local businesses, services, and deals around you
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-2 flex flex-col md:flex-row">
            <div className="relative flex-1 mb-2 md:mb-0 md:mr-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search businesses, services, products..."
                className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-800 text-left"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.term}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="relative mb-2 md:mb-0 md:mr-2">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <div 
                className="w-full md:w-40 pl-10 pr-4 py-3 rounded-md border border-gray-200 text-gray-800 cursor-pointer flex items-center justify-between"
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              >
                <span className="truncate">{location}</span>
                <ArrowRight className="h-4 w-4 transform rotate-90" />
              </div>
              
              {showLocationDropdown && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                  {popularLocations.map((loc, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-800"
                      onClick={() => {
                        setLocation(loc);
                        setShowLocationDropdown(false);
                      }}
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex-shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
