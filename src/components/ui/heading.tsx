
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeadingProps {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  className?: string;
}

export function Heading({
  children,
  as: Tag = "h2",
  size,
  className,
}: HeadingProps) {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
  };

  // Default size based on heading level if not specified
  const defaultSizes = {
    h1: "4xl",
    h2: "2xl",
    h3: "xl",
    h4: "lg",
    h5: "base",
    h6: "sm",
  };

  const selectedSize = size || defaultSizes[Tag as keyof typeof defaultSizes];

  return (
    <Tag className={cn(sizeClasses[selectedSize as keyof typeof sizeClasses], "font-bold", className)}>
      {children}
    </Tag>
  );
}
