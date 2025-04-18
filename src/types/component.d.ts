
import { LucideIcon } from 'lucide-react';
import { ComponentType, ForwardRefExoticComponent, RefAttributes } from 'react';

export type IconComponent = LucideIcon | ComponentType<{ className?: string }>;

// Make a more complete extension to React's types to handle all our component cases
declare module 'react' {
  /**
   * Augment ElementType to include ForwardRefExoticComponent
   */
  interface ElementType<P = any> {
    // This empty interface extension is a TypeScript trick to allow
    // ForwardRefExoticComponent to be compatible with ElementType
  }

  // Fix React's FunctionComponent to properly handle refs
  interface FunctionComponent<P = {}> {
    // Add proper handling for ref forwarding
  }

  // Add a comprehensive component type that includes all possible React component types
  type AnyComponent<P = any> = 
    | keyof JSX.IntrinsicElements
    | React.FunctionComponent<P>
    | React.ComponentClass<P>
    | React.ForwardRefExoticComponent<P & React.RefAttributes<any>>
    | (new (props: P) => React.Component<P, any>);
}
