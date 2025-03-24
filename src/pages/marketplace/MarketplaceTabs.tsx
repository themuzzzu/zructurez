
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, Tag, Search as SearchIcon, BadgePercent, Star } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface MarketplaceTabsProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  children: React.ReactNode;
}

export const MarketplaceTabs = ({ activeTab, setActiveTab, children }: MarketplaceTabsProps) => {
  return (
    <Tabs defaultValue="browse" className="w-full" value={activeTab} onValueChange={setActiveTab}>
      <div className="flex justify-center mb-8">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto bg-white dark:bg-zinc-800/60 rounded-full border border-gray-200 dark:border-zinc-700 p-1.5 shadow-sm">
          <TabsTrigger 
            value="browse" 
            className="flex items-center gap-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">Browse</span>
          </TabsTrigger>
          <TabsTrigger 
            value="categories" 
            className="flex items-center gap-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            <Tag className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">Categories</span>
          </TabsTrigger>
          <TabsTrigger 
            value="search" 
            className="flex items-center gap-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            <SearchIcon className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">Search</span>
          </TabsTrigger>
          <TabsTrigger 
            value="deals" 
            className="flex items-center gap-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            <BadgePercent className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">Deals</span>
          </TabsTrigger>
          <TabsTrigger 
            value="trending" 
            className="flex items-center gap-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">Trending</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      {children}
    </Tabs>
  );
};
