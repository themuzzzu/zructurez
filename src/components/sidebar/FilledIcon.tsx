
import React from "react";

interface FilledIconProps {
  Icon: React.ElementType;
}

export const FilledIcon = ({ Icon }: FilledIconProps) => {
  return (
    <div className="relative">
      <Icon 
        size={20} 
        fill="currentColor" 
        stroke="currentColor"
        strokeWidth={1.5}
        className="text-primary"
      />
      {/* Inner dot for highlight */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-background opacity-80"></div>
      {/* Inner line for additional detail */}
      <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-background opacity-70"></div>
    </div>
  );
};
