
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, ArrowUpRight, Package, Wrench, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EntityItem {
  id: string;
  title?: string;
  content?: string;
  views: number;
}

interface TopPerformingEntitiesProps {
  products: EntityItem[];
  services: EntityItem[];
  posts: EntityItem[];
}

export const TopPerformingEntities = ({
  products,
  services,
  posts,
}: TopPerformingEntitiesProps) => {
  const [selectedTab, setSelectedTab] = useState<"products" | "services" | "posts">("products");

  const getEntityData = () => {
    switch (selectedTab) {
      case "products":
        return { data: products, icon: <Package className="h-4 w-4" /> };
      case "services":
        return { data: services, icon: <Wrench className="h-4 w-4" /> };
      case "posts":
        return { data: posts, icon: <FileText className="h-4 w-4" /> };
      default:
        return { data: [], icon: null };
    }
  };

  const { data, icon } = getEntityData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Entities</CardTitle>
        <CardDescription>Entities with the most views</CardDescription>
        <Tabs 
          defaultValue="products" 
          className="mt-2"
          onValueChange={(value) => setSelectedTab(value as "products" | "services" | "posts")}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No {selectedTab} data available
          </div>
        ) : (
          <div className="space-y-4">
            {data.slice(0, 5).map((entity, index) => (
              <div key={entity.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">
                    {index + 1}
                  </Badge>
                  <div className="flex items-center gap-2">
                    {icon}
                    <div className="font-medium truncate max-w-[150px] sm:max-w-[300px]">
                      {entity.title || entity.content?.substring(0, 30) || `Item ${index + 1}`}
                      {entity.content && entity.content.length > 30 ? "..." : ""}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{entity.views}</span>
                  <ArrowUpRight className="h-4 w-4 ml-2 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
