
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
      <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6 bg-white dark:bg-zinc-800/60 rounded-full border border-gray-200 dark:border-zinc-700 p-1">
        <TabsTrigger 
          value="browse" 
          className="flex items-center gap-2 rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          <LayoutGrid className="h-4 w-4" />
          <span className="hidden sm:inline">Browse</span>
        </TabsTrigger>
        <TabsTrigger 
          value="categories" 
          className="flex items-center gap-2 rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          <Tag className="h-4 w-4" />
          <span className="hidden sm:inline">Categories</span>
        </TabsTrigger>
        <TabsTrigger 
          value="search" 
          className="flex items-center gap-2 rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          <SearchIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
        </TabsTrigger>
      </TabsList>
      
      {children}
    </Tabs>
  );
};
