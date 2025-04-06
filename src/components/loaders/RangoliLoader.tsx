
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface RangoliLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

export function RangoliLoader({ 
  size = 'md', 
  className, 
  color = "primary"
}: RangoliLoaderProps) {
  const sizeClass = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24"
  };
  
  const petalCount = 8;
  const petals = Array.from({ length: petalCount });
  
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn("relative", sizeClass[size])}>
        {petals.map((_, index) => (
          <motion.div
            key={index}
            className={cn(
              "absolute rounded-full bg-current",
              `text-${color}`
            )}
            style={{
              width: '25%',
              height: '25%',
              top: '37.5%',
              left: '37.5%',
              transformOrigin: '50% 50%',
              transform: `rotate(${index * (360 / petalCount)}deg) translateY(-150%)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.15,
              ease: "easeInOut"
            }}
          />
        ))}
        <motion.div
          className={cn(
            "absolute rounded-full bg-current w-1/4 h-1/4",
            `text-${color}`
          )}
          style={{
            top: '37.5%',
            left: '37.5%',
          }}
          animate={{ scale: [0.8, 1.1, 0.8] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
}
