
/// <reference types="vite/client" />

// Enhance component types to ensure children prop is always available
declare namespace React {
  interface ComponentProps {
    children?: React.ReactNode;
  }
}

// Make sure radix primitives all accept children
declare module '@radix-ui/*' {
  interface PrimitiveProps {
    children?: React.ReactNode;
  }
}
