
import React from "react";
import { BadgeDollarSign } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

const Logo: React.FC<LogoProps> = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  return (
    <div className="flex items-center">
      <BadgeDollarSign className={`text-primary ${sizeClasses[size]}`} />
    </div>
  );
};

export default Logo;
