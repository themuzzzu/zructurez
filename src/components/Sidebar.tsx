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
  MessagesSquare,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Sidebar = ({ className }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const routes = [
    { name: "Home", path: "/", icon: Home },
    { name: "Marketplace", path: "/marketplace", icon: Store },
    { name: "Services", path: "/services", icon: Wrench },
    { name: "Jobs", path: "/jobs", icon: Briefcase },
    { 
      type: "separator",
      label: "Social"
    },
    { name: "Communities", path: "/communities", icon: Users },
    { 
      type: "separator",
      label: "Messages"
    },
    { name: "Chats", path: "/messages", icon: MessageSquare },
    { name: "Groups", path: "/groups", icon: MessagesSquare },
    { 
      type: "separator",
      label: "Other"
    },
    { name: "Events", path: "/events", icon: Calendar },
    { name: "Maps", path: "/maps", icon: Map },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className={cn("h-screen border-r bg-card", className)}>
      <div className="space-y-1 p-3">
        {routes.map((route, index) => {
          if (route.type === "separator") {
            return (
              <div 
                key={index}
                className="px-3 py-2 text-xs font-semibold text-muted-foreground"
              >
                {route.label}
              </div>
            );
          }

          const Icon = route.icon;
          const isActive = location.pathname === route.path;
          return (
            <Button
              key={route.path}
              variant={isActive ? "secondary" : "ghost"}
              className="w-full justify-start h-12 px-3 gap-4 hover:bg-accent/50"
              onClick={() => navigate(route.path)}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">{route.name}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};