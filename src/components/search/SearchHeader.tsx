
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

interface SearchHeaderProps {
  query: string;
  totalResults: number;
  breadcrumbs?: Array<{ label: string; href: string }>;
}

export function SearchHeader({ query, totalResults, breadcrumbs = [] }: SearchHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
            <Link to={crumb.href} className="hover:text-primary">
              {crumb.label}
            </Link>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">
          Showing {totalResults.toLocaleString()} results for "{query}"
        </h1>
      </div>
      <Separator />
    </div>
  );
}
