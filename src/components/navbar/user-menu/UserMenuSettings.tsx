
import { Settings, LifeBuoy, LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface UserMenuSettingsProps {
  onNavigate: (path: string) => void;
  onSignOut: () => void;
}

export const UserMenuSettings = ({ onNavigate, onSignOut }: UserMenuSettingsProps) => {
  return (
    <>
      <DropdownMenuItem 
        onClick={() => onNavigate("/settings")}
        className="flex items-center py-2.5 px-3 cursor-pointer rounded-md transition-colors hover:bg-muted focus:bg-muted"
      >
        <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Settings</span>
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={() => onNavigate("/support")}
        className="flex items-center py-2.5 px-3 cursor-pointer rounded-md transition-colors hover:bg-muted focus:bg-muted"
      >
        <LifeBuoy className="mr-3 h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Help & Support</span>
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={onSignOut}
        className="flex items-center py-2.5 px-3 cursor-pointer rounded-md transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 focus:bg-red-50 dark:focus:bg-red-950/50"
      >
        <LogOut className="mr-3 h-4 w-4" />
        <span className="font-medium">Log out</span>
      </DropdownMenuItem>
    </>
  );
};
