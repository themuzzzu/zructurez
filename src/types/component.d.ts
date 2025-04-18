
import { ComponentType, ForwardRefExoticComponent, RefAttributes } from 'react';

declare module 'react' {
  interface ElementType<P = any> {
    (props: P): React.ReactElement | null;
  }

  type ComponentPropsWithRef<T extends ElementType> =
    T extends ForwardRefExoticComponent<infer P>
      ? P
      : ComponentPropsWithoutRef<T>;
}

declare namespace JSX {
  interface IntrinsicAttributes {
    children?: any;
    key?: any;
    ref?: any;
  }
}
