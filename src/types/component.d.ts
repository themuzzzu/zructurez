
import { ComponentType, ForwardRefExoticComponent, RefAttributes } from 'react';

// This file extends React's typings to properly support the children prop
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
    children?: React.ReactNode;
    key?: any;
    ref?: any;
  }
}

// Make sure React knows elements can have children
declare module 'react' {
  interface FunctionComponent<P = {}> {
    (props: P & { children?: React.ReactNode }, context?: any): React.ReactElement<any, any> | null;
  }
}

// Augment ForwardRefExoticComponent to ensure children are allowed
declare module 'react' {
  interface ForwardRefExoticComponent<P> {
    defaultProps?: Partial<P>;
    propTypes?: React.WeakValidationMap<P>;
    displayName?: string;
  }
}
