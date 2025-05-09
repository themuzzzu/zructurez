
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/nav/UserNav";
import { ShoppingBag, Home, Search } from "lucide-react";

export function MainNav() {
  return (
    <div className="border-b">
      <div className="flex items-center justify-between h-16 px-4 container">
        <div className="flex items-center">
          <Link to="/" className="font-bold text-xl mr-6 flex items-center">
            <ShoppingBag className="mr-2 h-6 w-6" />
            <span>Marketplace</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/marketplace">
                <Search className="h-4 w-4 mr-2" />
                Browse
              </Link>
            </Button>
          </nav>
        </div>
        
        <UserNav />
      </div>
    </div>
  );
}
