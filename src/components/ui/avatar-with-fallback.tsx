
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, getAvatarColorClass } from "@/utils/avatarUtils";

interface AvatarWithFallbackProps {
  src?: string | null;
  name?: string | null;
  userId?: string | null;
  className?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function AvatarWithFallback({
  src,
  name,
  userId,
  className = "",
  fallback,
  size = "md"
}: AvatarWithFallbackProps) {
  const [error, setError] = useState(false);
  
  // Determine size class
  const sizeClass = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-24 w-24"
  }[size];
  
  // Get initials from name
  const userInitials = getInitials(name, fallback);
  
  // Get unique avatar background color
  const colorClass = getAvatarColorClass(userId || name);
  
  // Generate dicebear URL if no src provided or error loading
  const defaultAvatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || userId || "User")}&backgroundColor=transparent&chars=1`;
  
  // If src provided but had an error, set dicebear
  const imageSrc = (error || !src) ? defaultAvatarUrl : src;

  return (
    <Avatar className={`${sizeClass} ${className}`}>
      <AvatarImage 
        src={imageSrc} 
        alt={name || "User"} 
        onError={() => setError(true)}
      />
      <AvatarFallback className={colorClass}>
        {userInitials}
      </AvatarFallback>
    </Avatar>
  );
}
