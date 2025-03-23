
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavButtonProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const NavButton = ({
  icon: Icon,
  label,
  isActive = false,
  onClick,
  className,
}: NavButtonProps) => {
  return (
    <Button
      variant="dark-nav"
      onClick={onClick}
      className={cn("justify-start text-base group", className)}
    >
      <div className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
        isActive ? "bg-zinc-800" : "group-hover:bg-zinc-800/70"
      )}>
        <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-muted-foreground group-hover:text-gray-300")} />
      </div>
      <span className={cn("ml-3", isActive ? "text-white" : "text-muted-foreground group-hover:text-gray-300")}>{label}</span>
    </Button>
  );
};
