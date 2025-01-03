import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Store,
  Wrench,
  Users,
  MessageSquare,
  Calendar,
  Settings,
  Briefcase,
  Map,
  Hash,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Sidebar = ({ className }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    { name: "General", icon: Hash },
    { name: "Events", icon: Calendar },
    { name: "News", icon: MessageSquare },
    { name: "Questions", icon: MessageSquare },
    { name: "Recommendations", icon: MessageSquare },
    { name: "Lost & Found", icon: MessageSquare },
    { name: "Community", icon: Users },
    { name: "Services", icon: Wrench },
  ];

  const routes = [
    { name: "Home", path: "/", icon: Home },
    { name: "Marketplace", path: "/marketplace", icon: Store },
    { name: "Services", path: "/services", icon: Wrench },
    { name: "Communities", path: "/communities", icon: Users },
    { name: "Messages", path: "/messages", icon: MessageSquare },
    { name: "Events", path: "/events", icon: Calendar },
    { name: "Business", path: "/business", icon: Briefcase },
    { name: "Maps", path: "/maps", icon: Map },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <ScrollArea className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {routes.map((route) => {
              const Icon = route.icon;
              return (
                <Button
                  key={route.path}
                  variant={location.pathname === route.path ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => navigate(route.path)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {route.name}
                </Button>
              );
            })}
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Categories
          </h2>
          <div className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.name}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    // Handle category selection
                    navigate(`/?category=${category.name.toLowerCase()}`);
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};