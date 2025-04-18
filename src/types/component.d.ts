
import { LucideIcon } from 'lucide-react';
import { ComponentType, ForwardRefExoticComponent, RefAttributes } from 'react';

export type IconComponent = LucideIcon | ComponentType<{ className?: string }>;

// Extend ElementType to properly handle ForwardRefExoticComponent
declare module 'react' {
  // This extends the existing ElementType to handle ForwardRefExoticComponent
  interface ElementType<P = any> {
    // Ensure it accepts ForwardRefExoticComponent
  }

  // Add a specific allowance for ForwardRefExoticComponent in type checks
  type ElementTypeWithForwardRef<P = any> = 
    | string 
    | React.ComponentType<P> 
    | ForwardRefExoticComponent<P> 
    | (new (props: P) => React.Component<P, any>)
    | keyof JSX.IntrinsicElements;
  
  // Ensure ReactElement can handle any type of component
  type ReactElementWithForwardRef<P = any, T extends ElementTypeWithForwardRef<any> = ElementTypeWithForwardRef<any>> = {
    type: T;
    props: P;
    key: Key | null;
  };
}
