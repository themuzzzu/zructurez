import { Bell, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
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
  const handleProfileAction = (action: string) => {
    toast.info(`${action} clicked - Feature coming soon!`);
  };

  return (
    <nav className="border-b bg-card py-3 fixed top-0 w-full z-50">
      <div className="container max-w-[1400px] flex items-center justify-between animate-fade-down">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-primary">ztructers</h1>
        </div>
        
        <div className="flex items-center gap-4 flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search neighborhoods, topics, posts..."
              className="w-full pl-10 pr-4 py-2 border rounded-full bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative transition-transform duration-300 hover:scale-110">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex gap-2 transition-all duration-300 hover:bg-accent/80">
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