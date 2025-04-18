
import { Layout } from "@/components/layout/Layout";
import { SearchLayout } from "@/components/search/SearchLayout";
import { SearchHeader } from "@/components/search/SearchHeader";
import { ImprovedSearchFilters } from "@/components/search/ImprovedSearchFilters";
import { ProductSearchResults } from "@/components/search/ProductSearchResults";
import { useSearchParams } from "react-router-dom";
import { useSearch } from "@/hooks/useSearch";
import { SearchFilters } from "@/types/search";
import { BusinessSearchResults } from "@/components/search/BusinessSearchResults";
import { ServiceSearchResults } from "@/components/search/ServiceSearchResults";

interface SearchResultsPageProps {
  type?: 'marketplace' | 'business' | 'services';
}

export default function SearchResultsPage({ type = 'marketplace' }: SearchResultsPageProps) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { results, isLoading, search } = useSearch({
    initialQuery: query,
    suggestionsEnabled: false
  });

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    search(query, newFilters);
  };

  const handleResetFilters = () => {
    search(query);
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Search", href: "/search" },
    { label: query, href: `/search?q=${query}` }
  ];

  const renderResults = () => {
    switch (type) {
      case 'business':
        return <BusinessSearchResults results={results} isLoading={isLoading} query={query} />;
      case 'services':
        return <ServiceSearchResults results={results} isLoading={isLoading} query={query} />;
      case 'marketplace':
      default:
        return (
          <ProductSearchResults
            results={results}
            isLoading={isLoading}
            query={query}
          />
        );
    }
  };

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto">
        <SearchLayout
          filters={
            <ImprovedSearchFilters
              filters={{}}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          }
          content={
            <div className="space-y-4">
              <SearchHeader 
                query={query}
                totalResults={results.length}
                breadcrumbs={breadcrumbs}
              />
              {renderResults()}
            </div>
          }
        />
      </div>
    </Layout>
  );
}
