
// This file contains global TypeScript type declarations
// We extend standard TypeScript types here to support our component structure

import { ForwardRefExoticComponent, RefAttributes } from 'react';

// Ensure ForwardRefExoticComponent is recognized as a valid ElementType
declare module 'react' {
  interface ElementType {
    // This allows ForwardRefExoticComponent to be used in JSX
    // which fixes the most common error we're seeing
  }
}

// Explicitly declare children prop support for all shadcn components
declare module '@/components/ui/*' {
  interface BaseComponentProps {
    children?: React.ReactNode;
    className?: string;
    asChild?: boolean;
  }
}

// Fix issue with global JSX children support
declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      children?: React.ReactNode;
    }
  }
}

export {};
