
import { User } from "@supabase/supabase-js";
import { DropdownMenuLabel } from "@/components/ui/dropdown-menu";

interface UserMenuHeaderProps {
  user: User | null;
}

export const UserMenuHeader = ({ user }: UserMenuHeaderProps) => {
  return (
    <div className="p-3 bg-muted/50 rounded-t-lg border-b">
      <DropdownMenuLabel className="space-y-1">
        <div className="text-xs text-muted-foreground font-normal">
          Signed in as
        </div>
        <div className="truncate font-medium text-sm">
          {user?.email || "Guest"}
        </div>
      </DropdownMenuLabel>
    </div>
  );
};
