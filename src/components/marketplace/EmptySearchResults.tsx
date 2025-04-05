
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

interface EmptySearchResultsProps {
  searchTerm?: string;
  onReset: () => void;
}

export const EmptySearchResults = ({ searchTerm, onReset }: EmptySearchResultsProps) => {
  const suggestedTerms = React.useMemo(() => {
    // Generate a few similar terms to what the user searched for
    if (!searchTerm || searchTerm.length < 3) {
      return ["electronics", "clothing", "accessories"];
    }

    const firstChar = searchTerm.charAt(0);
    const commonTerms = [
      "phone", "laptop", "watch", "shirt", "dress", "shoes", 
      "headphones", "camera", "tablet", "furniture"
    ];
    
    // Filter to show related terms or terms starting with the same letter
    return commonTerms
      .filter(term => 
        term.startsWith(firstChar.toLowerCase()) || 
        searchTerm.includes(term) || 
        term.includes(searchTerm)
      )
      .slice(0, 3);
      
  }, [searchTerm]);

  return (
    <motion.div 
      className="text-center py-16 px-4 max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-muted/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Search className="h-10 w-10 text-muted-foreground" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">No results found</h2>
      
      <p className="text-muted-foreground mb-6">
        We couldn't find any products matching <span className="font-medium">"{searchTerm}"</span>
      </p>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Try searching for:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestedTerms.map((term, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="text-sm"
                onClick={() => {
                  // Navigate to the search with this term
                  window.location.href = `/marketplace/search?q=${encodeURIComponent(term)}`;
                }}
              >
                {term}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            variant="default" 
            className="gap-2"
            onClick={() => {
              // This would open a dialog to post a product request
              alert('This feature would allow users to request products that are not available');
            }}
          >
            <PlusCircle className="h-4 w-4" />
            Post a Product Request
          </Button>
        </div>
        
        <div className="pt-2">
          <Button 
            variant="link" 
            onClick={onReset}
          >
            Reset filters
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
