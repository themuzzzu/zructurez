
import React from "react";

interface FilledIconProps {
  Icon: React.ElementType;
}

export const FilledIcon = ({ Icon }: FilledIconProps) => {
  return (
    <div className="relative">
      <Icon 
        size={20} 
        className="text-primary"
        strokeWidth={2.5}
        fill="none"
      />
    </div>
  );
};
