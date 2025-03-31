
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
    </div>
  );
};
