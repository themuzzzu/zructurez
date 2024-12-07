import { cn } from "@/lib/utils";
import { Home, Users2, MessageSquare, Calendar, ShoppingBag, Map, Settings, Wrench, Building2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const location = useLocation();
  
  const navigation = [
    { name: "Feed", href: "/", icon: Home },
    { name: "Groups", href: "/groups", icon: Users2 },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
    { name: "Services", href: "/services", icon: Wrench },
    { name: "Business", href: "/business", icon: Building2 },
    { name: "Maps", href: "/maps", icon: Map },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className={cn("pb-12", className)} {...props}>
      <nav className="space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent dark:hover:text-black dark:focus:text-black",
                isActive && "bg-accent font-medium dark:text-black"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}