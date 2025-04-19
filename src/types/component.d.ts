
import { ComponentType, ForwardRefExoticComponent, RefAttributes } from 'react';

// Define IconComponent type
export type IconComponent = React.ComponentType<{ 
  className?: string; 
  size?: number | string;
}>;

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

  // Important: explicitly add children to JSX.IntrinsicAttributes
  interface FunctionComponent<P = {}> {
    (props: P & { children?: React.ReactNode }, context?: any): React.ReactElement<any, any> | null;
  }

  // Add children to ForwardRefExoticComponent
  interface ForwardRefExoticComponent<P = {}> {
    defaultProps?: Partial<P>;
    propTypes?: React.WeakValidationMap<P>;
    displayName?: string;
    (props: P & { children?: React.ReactNode }, ref?: React.Ref<any>): React.ReactElement | null;
  }
}

// Ensure that JSX inherently supports children props
declare namespace JSX {
  interface IntrinsicAttributes {
    children?: React.ReactNode;
    key?: any;
    ref?: any;
  }
}
