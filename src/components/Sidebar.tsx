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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Sidebar = ({ className }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const routes = [
    { name: "Home", path: "/", icon: Home },
    { name: "Marketplace", path: "/marketplace", icon: Store },
    { name: "Services", path: "/services", icon: Wrench },
    { name: "Jobs", path: "/jobs", icon: Briefcase },
    { name: "Communities", path: "/communities", icon: Users },
    { name: "Messages", path: "/messages", icon: MessageSquare },
    { name: "Events", path: "/events", icon: Calendar },
    { name: "Business", path: "/business", icon: Briefcase },
    { name: "Maps", path: "/maps", icon: Map },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className={cn("h-screen border-r", className)}>
      <div className="space-y-2 p-2">
        <TooltipProvider delayDuration={0}>
          {routes.map((route) => {
            const Icon = route.icon;
            return (
              <Tooltip key={route.path}>
                <TooltipTrigger asChild>
                  <Button
                    variant={location.pathname === route.path ? "secondary" : "ghost"}
                    className="w-full p-3 justify-center h-12"
                    onClick={() => navigate(route.path)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{route.name}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {route.name}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
};