
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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-0 max-w-6xl mx-auto">
        {/* Main Content */}
        <main className="col-span-1 md:col-span-8 lg:col-span-8 border-r border-zinc-200/50 dark:border-zinc-800/50">
          {children}
        </main>

        {/* Right Sidebar */}
        <aside className="hidden md:block md:col-span-4 lg:col-span-4">
          <div className="sticky top-20 space-y-4 pl-3">
            <div className="bg-muted/30 rounded-lg overflow-hidden">
              <div className="p-3">
                <h3 className="font-semibold flex items-center text-sm">
                  <TrendingUp className="w-3.5 h-3.5 mr-2" />
                  Trending Topics
                </h3>
                <div className="mt-2 space-y-2">
                  {["Local Business", "Neighborhood Events", "Community Help"].map((topic, i) => (
                    <div key={i} className="hover:bg-muted/50 p-2 rounded-md cursor-pointer">
                      <div className="text-xs text-muted-foreground">Trending in your area</div>
                      <div className="font-medium text-sm">{topic}</div>
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
