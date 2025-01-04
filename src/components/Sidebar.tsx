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
  Building,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Sidebar = ({ className }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const routes = [
    { name: "Home", path: "/", icon: Home },
    { name: "Marketplace", path: "/marketplace", icon: Store },
    { name: "Services", path: "/services", icon: Wrench },
    { name: "Business", path: "/business", icon: Building },
    { name: "Jobs", path: "/jobs", icon: Briefcase },
    { name: "Communities", path: "/communities", icon: Users },
    { name: "Messages", path: "/messages", icon: MessageSquare },
    { name: "Events", path: "/events", icon: Calendar },
    { name: "Maps", path: "/maps", icon: Map },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className={cn("h-screen border-r bg-card overflow-y-auto", className)}>
      <div className="space-y-1 p-3">
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = location.pathname === route.path;

          return (
            <Button
              key={route.path}
              variant={isActive ? "secondary" : "ghost"}
              className="w-full justify-start h-10 px-3 gap-3 hover:bg-accent/50"
              onClick={() => navigate(route.path)}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="text-sm font-medium">{route.name}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};