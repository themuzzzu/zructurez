
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface AutocompleteSearchProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearchSelect: (term: string) => void;
  className?: string;
}

export const AutocompleteSearch = ({
  placeholder = 'Search...',
  value,
  onChange,
  onSearchSelect,
  className = '',
}: AutocompleteSearchProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // This would typically fetch from an API, but for demo purposes, we'll use static suggestions
  useEffect(() => {
    if (value.length > 1) {
      // Example suggestions - in a real app, you'd fetch these from an API
      const demoSuggestions = [
        `${value} products`,
        `best ${value}`,
        `${value} deals`,
        `${value} near me`,
        `top rated ${value}`
      ];
      setSuggestions(demoSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearchSelect(value);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    onSearchSelect(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-10 h-12 w-full"
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        <Button 
          type="submit" 
          size="icon" 
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10"
        >
          <Search className="h-5 w-5" />
        </Button>
      </form>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg">
          <ul>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
