import { Bell, Menu, Search, MessageSquare, Home, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export const Navbar = () => {
  return (
    <nav className="border-b bg-card py-4 fixed top-0 w-full z-50">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-primary">Neighborly</h1>
          
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button variant="ghost" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </Button>
            <Button variant="ghost" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Groups
            </Button>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search posts, neighbors, and more..."
              className="w-full pl-10 pr-4 py-2 border rounded-full bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          <Separator orientation="vertical" className="h-6 hidden md:block" />
          <Button variant="ghost" className="hidden md:flex gap-2">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="avatar" 
              className="h-6 w-6 rounded-full" 
            />
            <span className="text-sm">Felix</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};