
declare global {
  namespace React {
    type ElementType<P = any> = {
      [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K] ? K : never
    }[keyof JSX.IntrinsicElements] | React.ComponentType<P>;
    
    interface FunctionComponent<P = {}> {
      (props: P, context?: any): ReactElement<any, any> | null;
      displayName?: string;
      defaultProps?: Partial<P>;
    }
    
    type FC<P = {}> = FunctionComponent<P>;
    
    interface ComponentProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> {
      ref?: LegacyRef<any>;
      key?: Key;
      children?: ReactNode;
    }
    
    type ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> = {
      type: T;
      props: P;
      key: Key | null;
    };
  }
}

export {};
