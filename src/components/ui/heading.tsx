
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function Heading({ 
  children, 
  className, 
  as: Component = "h2", 
  ...props 
}: HeadingProps) {
  return (
    <Component
      className={cn(
        "text-2xl font-bold tracking-tight mb-4",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

// For backwards compatibility
export const SectionTitle = ({ title }: { title: string }) => {
  return <Heading>{title}</Heading>;
};
