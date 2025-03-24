
import { useState } from "react";
import { Layout } from "./Layout";
import { FollowSuggestions } from "../follow/FollowSuggestions";
import { 
  Home, 
  Bell, 
  Search, 
  Mail, 
  Bookmark, 
  User, 
  Settings,
  TrendingUp
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { RecommendedServices } from "../service-recommendations/RecommendedServices";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export function HomeLayout({ children }: HomeLayoutProps) {
  const location = useLocation();
  const [userLocation, setUserLocation] = useState<string>("Local Area");
  
  const navigationItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Explore", path: "/explore" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Mail, label: "Messages", path: "/messages" },
    { icon: Bookmark, label: "Bookmarks", path: "/bookmarks" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <Layout>
      <div className="container grid grid-cols-1 md:grid-cols-12 gap-4 p-4 max-w-7xl mx-auto">
        {/* Left Sidebar */}
        <div className="hidden md:block md:col-span-3 lg:col-span-2">
          <div className="sticky top-20 flex flex-col space-y-6">
            <div className="flex flex-col space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-full hover:bg-muted transition-colors ${
                    location.pathname === item.path ? "font-bold" : ""
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="col-span-1 md:col-span-6 lg:col-span-7">
          {children}
        </main>

        {/* Right Sidebar */}
        <aside className="hidden md:block md:col-span-3">
          <div className="sticky top-20 space-y-6">
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
