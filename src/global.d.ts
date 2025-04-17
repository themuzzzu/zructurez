
declare global {
  namespace React {
    type ReactNode = 
      | React.ReactElement<any, any> 
      | React.ReactFragment 
      | React.ReactPortal 
      | boolean 
      | null 
      | undefined;
    
    type FC<P = {}> = React.FunctionComponent<P>;
    
    interface FunctionComponent<P = {}> {
      (props: P, context?: any): React.ReactElement<any, any> | null;
      displayName?: string;
      defaultProps?: Partial<P>;
    }
    
    type ComponentProps<T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>> =
      T extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[T] :
      T extends React.JSXElementConstructor<infer P> ? P : {};
    
    type ElementType<P = any> = {
      [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K] ? K : never
    }[keyof JSX.IntrinsicElements] | React.ComponentType<P>;
    
    type ComponentType<P = {}> = React.ComponentClass<P> | React.FunctionComponent<P>;
    
    interface RefObject<T> {
      readonly current: T | null;
    }
    
    type Dispatch<A> = (value: A) => void;
    type SetStateAction<S> = S | ((prevState: S) => S);
    
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      // Standard HTML Attributes
      className?: string;
      id?: string;
      role?: string;
      style?: React.CSSProperties;
      tabIndex?: number;
      // Any other attribute
      [key: string]: any;
    }
  }
}

export {};
