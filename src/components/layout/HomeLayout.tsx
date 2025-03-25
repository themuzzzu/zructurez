
import { useState } from "react";
import { Layout } from "./Layout";
import { FollowSuggestions } from "../follow/FollowSuggestions";
import { TrendingUp } from "lucide-react";
import { RecommendedServices } from "../service-recommendations/RecommendedServices";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export function HomeLayout({ children }: HomeLayoutProps) {
  const [userLocation, setUserLocation] = useState<string>("Local Area");

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-7xl mx-auto">
        {/* Main Content */}
        <main className="col-span-1 md:col-span-9 lg:col-span-8 border-r border-zinc-200 dark:border-zinc-800">
          {children}
        </main>

        {/* Right Sidebar */}
        <aside className="hidden md:block md:col-span-3 lg:col-span-4">
          <div className="sticky top-20 space-y-4 pl-4">
            <div className="bg-muted/50 rounded-lg overflow-hidden">
              <div className="p-4">
                <h3 className="font-semibold flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending Topics
                </h3>
                <div className="mt-3 space-y-3">
                  {["Local Business", "Neighborhood Events", "Community Help"].map((topic, i) => (
                    <div key={i} className="hover:bg-muted p-2 rounded-md cursor-pointer">
                      <div className="text-xs text-muted-foreground">Trending in your area</div>
                      <div className="font-medium">{topic}</div>
                      <div className="text-xs text-muted-foreground">{100 * (i + 1)} posts</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <RecommendedServices userLocation={userLocation} />
            
            <FollowSuggestions />
          </div>
        </aside>
      </div>
    </Layout>
  );
}
