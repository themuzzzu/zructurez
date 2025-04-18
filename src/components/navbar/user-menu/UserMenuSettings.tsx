
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
        className="hover:bg-muted py-2 cursor-pointer"
      >
        <Settings className="mr-3 h-4 w-4" />
        <span>Settings</span>
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={() => onNavigate("/support")}
        className="hover:bg-muted py-2 cursor-pointer"
      >
        <LifeBuoy className="mr-3 h-4 w-4" />
        <span>Help & Support</span>
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={onSignOut}
        className="hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 py-2 cursor-pointer"
      >
        <LogOut className="mr-3 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </>
  );
};
