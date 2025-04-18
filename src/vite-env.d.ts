
/// <reference types="vite/client" />

// Extend the built-in React types to properly handle Radix UI components 
declare namespace React {
  // Make ForwardRefExoticComponent compatible with ElementType constraints
  interface ElementType {
    // Empty interface extension - this helps TypeScript recognize ForwardRefExoticComponents
  }
}
