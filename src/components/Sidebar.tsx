import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Sidebar = ({ className }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className={cn("h-screen", className)}>
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
  );
};