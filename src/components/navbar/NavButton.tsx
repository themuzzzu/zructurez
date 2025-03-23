
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
      variant={isActive ? "dark-nav-active" : "dark-nav"}
      onClick={onClick}
      className={cn("justify-start text-base", className)}
    >
      <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-muted-foreground")} />
      <span className={cn(isActive ? "text-white" : "text-muted-foreground")}>{label}</span>
    </Button>
  );
};
