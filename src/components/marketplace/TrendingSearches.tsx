
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { useState } from "react";

interface TrendingSearchesProps {
  onSearchSelect: (search: string) => void;
}

export const TrendingSearches = ({ onSearchSelect }: TrendingSearchesProps) => {
  const [searches] = useState([
    { term: "Wireless Earbuds", count: 2540 },
    { term: "Smart Watch", count: 1820 },
    { term: "Laptop Stand", count: 1350 },
    { term: "Phone Charger", count: 1120 },
    { term: "Bluetooth Speaker", count: 980 },
    { term: "Desk Lamp", count: 860 }
  ]);
  
  return (
    <div className="bg-card rounded-lg p-4 border border-border mb-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Trending Searches</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {searches.map((search, index) => (
          <Badge 
            key={index} 
            variant="outline" 
            className="cursor-pointer hover:bg-primary/10 transition-colors py-1.5"
            onClick={() => onSearchSelect(search.term)}
          >
            {search.term}
            <span className="ml-1.5 text-xs text-muted-foreground">({search.count})</span>
          </Badge>
        ))}
      </div>
    </div>
  );
};
