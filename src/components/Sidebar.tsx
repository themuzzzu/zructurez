
import {
  Home,
  LayoutDashboard,
  Settings,
  ShoppingBag,
  Users,
  Search,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { usePathname } from "@/hooks/usePathname";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (isSmallScreen) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [isSmallScreen]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navItems = [
    {
      title: "Home",
      href: "/",
      icon: <Home className="w-5 h-5" />,
    },
    {
      title: "Marketplace",
      href: "/marketplace",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      title: "Zructs",
      href: "/zructs",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      title: "Search",
      href: "/search",
      icon: <Search className="w-5 h-5" />,
    },
    {
      title: "Businesses",
      href: "/businesses",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      title: "Services",
      href: "/services",
      icon: <Users className="w-5 h-5" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div
      className={`hidden sm:flex flex-col w-[72px] bg-secondary border-r border-r-muted h-full ${className} transition-all duration-300`}
    >
      <nav className="flex flex-col py-4 h-full">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-2 py-2 text-sm font-medium transition-colors hover:bg-secondary/50 rounded-md ${
                  isActive
                    ? "text-primary bg-secondary/50"
                    : "text-muted-foreground"
                }`
              }
            >
              {item.icon}
              <span className="hidden sm:block">{item.title}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
