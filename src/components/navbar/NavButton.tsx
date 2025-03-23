
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
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Button>
  );
};
