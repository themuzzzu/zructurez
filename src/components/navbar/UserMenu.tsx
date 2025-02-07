
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UserMenuProps {
  profile: {
    avatar_url?: string;
    username?: string;
  } | null;
}

export const UserMenu = ({ profile }: UserMenuProps) => {
  const navigate = useNavigate();

  const handleProfileAction = async (action: string) => {
    if (action === "Sign out") {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error signing out");
      } else {
        navigate("/auth");
      }
    } else if (action === "Profile") {
      navigate("/profile");
    } else if (action === "Settings") {
      navigate("/settings");
    } else {
      toast.info(`${action} clicked - Feature coming soon!`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex gap-2 transition-all duration-300 hover:bg-accent/80">
          <img 
            src={profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
            alt="avatar" 
            className="h-6 w-6 rounded-full transition-transform duration-300 hover:scale-110" 
          />
          <span className="text-sm hidden sm:inline">{profile?.username || 'User'}</span>
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
  );
};
