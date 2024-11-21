import { Bell, Menu, Search, MessageSquare, Home, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const Navbar = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
    toast.success("Welcome home!");
  };

  const handleProfileAction = (action: string) => {
    toast.info(`${action} clicked - Feature coming soon!`);
  };

  return (
    <nav className="border-b bg-card py-4 fixed top-0 w-full z-50">
      <div className="container flex items-center justify-between animate-fade-down">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-primary">Neighborly</h1>
          
          <div className="hidden md:flex items-center gap-2">
            <Button 
              variant="glow" 
              size="sm" 
              onClick={handleHomeClick}
              className="transition-all duration-300 hover:bg-accent/80"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button variant="ghost" size="sm" className="transition-all duration-300 hover:bg-accent/80">
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </Button>
            <Button variant="ghost" size="sm" className="transition-all duration-300 hover:bg-accent/80">
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
              className="w-full pl-10 pr-4 py-2 border rounded-full bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative transition-transform duration-300 hover:scale-110">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          <Separator orientation="vertical" className="h-6 hidden md:block" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hidden md:flex gap-2 transition-all duration-300 hover:bg-accent/80">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                  alt="avatar" 
                  className="h-6 w-6 rounded-full transition-transform duration-300 hover:scale-110" 
                />
                <span className="text-sm">Felix</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleProfileAction("Profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleProfileAction("Settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleProfileAction("Help")}>
                Help
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleProfileAction("Sign out")}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};