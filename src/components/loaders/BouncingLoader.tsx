
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Car, Coffee, PalmtreeIcon } from "lucide-react";

type IconType = "car" | "coffee" | "palmtree" | "dot";

interface BouncingLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  iconType?: IconType[];
  color?: string;
  count?: number;
}

export function BouncingLoader({ 
  size = 'md', 
  className, 
  iconType = ["dot", "dot", "dot"],
  color = "primary",
  count = 3
}: BouncingLoaderProps) {
  const icons = iconType.length >= count ? iconType : [...iconType, ...Array(count - iconType.length).fill("dot")];
  
  const sizeMap = {
    sm: { icon: 16, container: "h-6" },
    md: { icon: 24, container: "h-10" },
    lg: { icon: 32, container: "h-14" }
  };
  
  const getIconComponent = (type: IconType, index: number) => {
    const iconProps = {
      size: sizeMap[size].icon,
      className: cn(`text-${color}`)
    };
    
    switch(type) {
      case "car":
        return <Car {...iconProps} />;
      case "coffee":
        return <Coffee {...iconProps} />;
      case "palmtree":
        return <PalmtreeIcon {...iconProps} />;
      default:
        return (
          <div 
            className={cn(
              "rounded-full bg-current",
              `text-${color}`,
              `w-${sizeMap[size].icon / 4} h-${sizeMap[size].icon / 4}`
            )} 
          />
        );
    }
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className, sizeMap[size].container)}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          animate={{
            y: [0, -15, 0]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.15,
            ease: "easeInOut"
          }}
        >
          {getIconComponent(icons[index % icons.length], index)}
        </motion.div>
      ))}
    </div>
  );
}
