
import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { 
  Home, ShoppingBag, 
  CalendarClock, Briefcase, 
  Heart, MessageSquare,
  Map, BadgeDollarSign, Wrench
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavButtonProps = {
  pathname: string;
  collapsed?: boolean;
};

export const NavButton = forwardRef<HTMLDivElement, NavButtonProps>(
  ({ pathname, collapsed }, ref) => {
    const links = [
      { title: "Home", href: "/", icon: Home },
      { title: "Marketplace", href: "/marketplace", icon: ShoppingBag },
      { title: "Services", href: "/services", icon: Wrench },
      { title: "Businesses", href: "/businesses", icon: Briefcase },
      { title: "Events", href: "/events", icon: CalendarClock },
      { title: "Pricing", href: "/pricing", icon: BadgeDollarSign },
      { title: "Wishlist", href: "/wishlist", icon: Heart },
      { title: "Messages", href: "/messages", icon: MessageSquare },
      { title: "Maps", href: "/maps", icon: Map },
    ];

    return (
      <div ref={ref} className="flex flex-col items-center gap-1 md:gap-2">
        {links.map(({ title, href, icon: Icon }) => {
          const isActive = 
            href === "/" 
              ? pathname === "/" 
              : pathname.startsWith(href);
              
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                "w-full flex font-medium items-center justify-center md:justify-start px-2 py-1.5 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5 md:mr-2" />
              {!collapsed && <span className="hidden md:inline-block">{title}</span>}
            </Link>
          );
        })}
      </div>
    );
  }
);

NavButton.displayName = "NavButton";
