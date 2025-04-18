
import { LucideIcon } from 'lucide-react';
import { ComponentType, ForwardRefExoticComponent, RefAttributes } from 'react';

export type IconComponent = LucideIcon | ComponentType<{ className?: string }>;

// Make a more complete extension to React's types to handle all our component cases
declare module 'react' {
  // Properly extend ElementType to include ForwardRefExoticComponent
  type ElementType<P = any> = 
    | keyof JSX.IntrinsicElements
    | FunctionComponent<P>
    | ComponentClass<P>
    | ForwardRefExoticComponent<P & RefAttributes<any>>;
  
  // Augment the definition to include Exotic Components
  type ComponentProps<T extends ElementType> = T extends ForwardRefExoticComponent<infer P>
    ? P
    : T extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[T]
    : T extends ComponentType<infer P>
    ? P
    : never;
}
