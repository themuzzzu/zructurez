
import { User } from "@supabase/supabase-js";
import { DropdownMenuLabel } from "@/components/ui/dropdown-menu";

interface UserMenuHeaderProps {
  user: User | null;
}

export const UserMenuHeader = ({ user }: UserMenuHeaderProps) => {
  return (
    <div className="p-2 bg-muted/50 rounded-t-md">
      <DropdownMenuLabel>
        <div className="font-normal text-muted-foreground text-xs">Signed in as</div>
        <div className="truncate font-medium text-sm">
          {user?.email || "Guest"}
        </div>
      </DropdownMenuLabel>
    </div>
  );
};
