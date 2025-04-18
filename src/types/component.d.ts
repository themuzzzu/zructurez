
import { ComponentType, ForwardRefExoticComponent, RefAttributes } from 'react';

// Type definitions for React components
declare module 'react' {
  // Type augmentation to make TypeScript recognize ForwardRefExoticComponent as a valid ElementType
  interface ElementType<P = any> {
    // This allows React's ElementType to properly handle ForwardRefExoticComponent
  }

  // Add proper JSX IntrinsicAttributes support
  type ComponentPropsWithRef<T extends ElementType> =
    T extends ForwardRefExoticComponent<infer P>
      ? P
      : ComponentPropsWithoutRef<T>;
}

// Add proper JSX IntrinsicAttributes support
declare namespace JSX {
  interface IntrinsicAttributes {
    // This ensures React components accept children properly
    children?: any;
    key?: any;
  }
}
