
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

export interface AvatarWithFallbackProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  userId?: string;
}

export const AvatarWithFallback: React.FC<AvatarWithFallbackProps> = ({ 
  src, 
  name = "User", 
  size = "md", 
  className = "",
  userId
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10", 
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  const getInitials = (displayName: string) => {
    if (!displayName) return "U";
    return displayName
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback className="bg-primary/10 text-primary">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};
