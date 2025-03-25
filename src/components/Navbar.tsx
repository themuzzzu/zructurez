
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { NotificationButton } from "./navbar/NotificationButton";
import { CartButton } from "./navbar/CartButton";
import { UserMenu } from "./navbar/UserMenu";
import { MobileNav } from "./navbar/MobileNav";
import { SearchBox } from "./search/SearchBox";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "./ThemeProvider";

export const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { theme } = useTheme();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <nav className="border-b bg-background py-3 fixed top-0 left-0 right-0 w-full z-50 h-16">
        <div className="container max-w-[1400px] flex items-center justify-between animate-fade-down">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar className="w-full" />
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold text-primary">
              Zructures
            </h1>
          </div>

          {isHomePage && (
            <SearchBox className="flex-1 max-w-xl mx-4 hidden md:block" />
          )}

          <div className="flex items-center gap-2">
            <NotificationButton />
            <CartButton />
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            <UserMenu profile={profile} />
          </div>
        </div>
      </nav>

      <MobileNav />
    </>
  );
};
