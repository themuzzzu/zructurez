
import { ComponentType, ForwardRefExoticComponent, RefAttributes } from 'react';

declare module 'react' {
  // Ensure that React's ElementType can handle components with children props
  interface ElementType<P = any> {
    (props: P): React.ReactElement | null;
  }

  // Add proper type support for refs
  type ComponentPropsWithRef<T extends ElementType> =
    T extends ForwardRefExoticComponent<infer P>
      ? P
      : ComponentPropsWithoutRef<T>;
}

// Ensure that JSX inherently supports children props
declare namespace JSX {
  interface IntrinsicAttributes {
    children?: any;
    key?: any;
    ref?: any;
  }
}
