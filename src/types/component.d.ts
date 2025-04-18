
import { LucideIcon } from 'lucide-react';
import { ComponentType, ForwardRefExoticComponent, RefAttributes } from 'react';

export type IconComponent = LucideIcon | ComponentType<{ className?: string }>;

// Type definitions for React components
declare module 'react' {
  // Extend ElementType to handle ForwardRefExoticComponent
  type ElementType<P = any> =
    | keyof JSX.IntrinsicElements
    | FunctionComponent<P>
    | ComponentClass<P>
    | ForwardRefExoticComponent<P>
    | (new (props: P) => Component<P, any>);

  // Make ComponentProps handle ForwardRefExoticComponent
  type ComponentProps<T extends ElementType> =
    T extends ForwardRefExoticComponent<infer P>
      ? P
      : T extends keyof JSX.IntrinsicElements
      ? JSX.IntrinsicElements[T]
      : T extends ComponentType<infer P>
      ? P
      : never;
}

// Empty interface to allow module augmentation
declare namespace JSX {
  interface IntrinsicAttributes {
    // This empty interface is needed to prevent type errors when using ForwardRefExoticComponent
  }
}
