
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, Tag, Search as SearchIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface MarketplaceTabsProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  children: React.ReactNode;
}

export const MarketplaceTabs = ({ activeTab, setActiveTab, children }: MarketplaceTabsProps) => {
  return (
    <Tabs defaultValue="browse" className="w-full" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-4">
        <TabsTrigger value="browse" className="flex items-center gap-2">
          <LayoutGrid className="h-4 w-4" />
          <span className="hidden sm:inline">Browse</span>
        </TabsTrigger>
        <TabsTrigger value="categories" className="flex items-center gap-2">
          <Tag className="h-4 w-4" />
          <span className="hidden sm:inline">Categories</span>
        </TabsTrigger>
        <TabsTrigger value="search" className="flex items-center gap-2">
          <SearchIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
        </TabsTrigger>
      </TabsList>
      
      {children}
    </Tabs>
  );
};
