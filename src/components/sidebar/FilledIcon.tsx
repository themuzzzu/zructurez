
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
      {/* Inner highlight - will be white in dark mode and black in light mode */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-background opacity-80"></div>
    </div>
  );
};
