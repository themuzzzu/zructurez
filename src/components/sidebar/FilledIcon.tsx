
import React from "react";

interface FilledIconProps {
  Icon: React.ElementType;
}

export const FilledIcon = ({ Icon }: FilledIconProps) => {
  return (
    <div className="relative">
      <Icon 
        size={20} 
        fill="white" 
        stroke="black" 
        strokeWidth={1.5}
      />
    </div>
  );
};
