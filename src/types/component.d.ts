
import { LucideIcon } from 'lucide-react';
import { ComponentType, ForwardRefExoticComponent, RefAttributes } from 'react';

export type IconComponent = LucideIcon | ComponentType<{ className?: string }>;

// Type definitions for React components
declare module 'react' {
  // Make ElementType accept ForwardRefExoticComponent
  interface ElementType<P = any> {
    // This is an interface extension to make TypeScript recognize ForwardRefExoticComponent as an ElementType
  }

  // Extend ComponentProps to handle ForwardRefExoticComponent properly
  type ComponentProps<T extends ElementType> =
    T extends ForwardRefExoticComponent<infer P>
      ? P
      : T extends keyof JSX.IntrinsicElements
      ? JSX.IntrinsicElements[T]
      : T extends ComponentType<infer P>
      ? P
      : never;
}

// Add proper JSX IntrinsicAttributes support
declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      // Empty interface extension to handle ForwardRefExoticComponent
    }
  }
}
