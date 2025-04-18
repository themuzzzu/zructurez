
import { LucideIcon } from 'lucide-react';
import { ComponentType, ForwardRefExoticComponent, RefAttributes } from 'react';

export type IconComponent = LucideIcon | ComponentType<{ className?: string }>;

// Make a more complete extension to React's types to handle all our component cases
declare module 'react' {
  /**
   * Override ElementType to properly handle ForwardRefExoticComponent
   */
  interface ElementType<P = any> {
    // This empty interface extension creates a "module augmentation" that allows
    // ForwardRefExoticComponent to be compatible with ElementType
  }
  
  // Add this type to help TypeScript understand our component types
  type AnyComponent<P = any> = 
    | keyof JSX.IntrinsicElements
    | React.FunctionComponent<P>
    | React.ComponentClass<P>
    | ForwardRefExoticComponent<any>
    | (new (props: P) => React.Component<P, any>)
    | (new (props: P) => React.Component<P>);
}
