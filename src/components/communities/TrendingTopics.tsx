
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const TrendingTopics = () => {
  const [trendingTopics, setTrendingTopics] = useState<{name: string, count: number}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would query for trending hashtags/topics
        // For now, we'll mock some trending topics
        const mockTopics = [
          { name: "technology", count: 24 },
          { name: "healthyliving", count: 19 },
          { name: "pets", count: 15 },
          { name: "cooking", count: 12 },
          { name: "sports", count: 10 },
          { name: "travel", count: 8 },
          { name: "music", count: 7 },
          { name: "photography", count: 6 }
        ];
        
        setTrendingTopics(mockTopics);
      } catch (error) {
        console.error("Error fetching trending topics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingTopics();
  }, []);

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-medium">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-24 bg-muted rounded-full animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic) => (
              <Badge key={topic.name} variant="secondary" className="px-3 py-1 cursor-pointer hover:bg-secondary/80">
                <Hash className="h-3 w-3 mr-1" />
                {topic.name}
                <span className="ml-1 text-xs text-muted-foreground">({topic.count})</span>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
