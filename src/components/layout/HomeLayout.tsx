
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
        <main className="col-span-1 md:col-span-12 lg:col-span-12">
          {children}
        </main>
      </div>
    </Layout>
  );
}
