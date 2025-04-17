
/// <reference types="react" />
/// <reference types="react-dom" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      VITE_SUPABASE_URL: string;
      VITE_SUPABASE_ANON_KEY: string;
    }
  }

  // Make React available globally for JSX
  const React: typeof import('react');
}

// This ensures React is properly defined globally
import React from 'react';
import ReactDOM from 'react-dom/client';

declare global {
  // Redefine React in global scope more explicitly
  const React: typeof import('react');
  const ReactDOM: typeof import('react-dom/client');

  // Add React namespace definition with all necessary types
  namespace React {
    // Element types
    interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
      type: T;
      props: P;
      key: Key | null;
    }

    type JSXElementConstructor<P> = ((props: P) => ReactElement | null) | (new (props: P) => Component<P, any>);
    type Key = string | number;
    type ReactNode = ReactElement | string | number | Iterable<ReactNode> | ReactPortal | boolean | null | undefined;
    type ElementType<P = any> = {
      [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K] ? K : never
    }[keyof JSX.IntrinsicElements] | ComponentType<P>;
    type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;
    type ComponentClass<P = {}, S = ComponentState> = new (props: P, context?: any) => Component<P, S>;
    type FunctionComponent<P = {}> = FC<P>;
    type FC<P = {}> = (props: P, context?: any) => ReactElement<any, any> | null;
    type ReactPortal = any;
    type ComponentState = any;
    type RefObject<T> = { readonly current: T | null };
    type Ref<T> = RefCallback<T> | RefObject<T> | null;
    type LegacyRef<T> = string | Ref<T>;
    type RefCallback<T> = (instance: T | null) => void;
    type Dispatch<A> = (value: A) => void;
    type SetStateAction<S> = S | ((prevState: S) => S);

    // Event types
    interface FormEvent<T = Element> extends SyntheticEvent<T> {}
    interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
      target: T & EventTarget & {
        value: string;
        name: string;
        files?: FileList;
      };
    }
    interface MouseEvent<T = Element, E = NativeMouseEvent> extends SyntheticEvent<T, E> {
      clientX: number;
      clientY: number;
    }
    interface KeyboardEvent<T = Element> extends SyntheticEvent<T> {}

    interface SyntheticEvent<T = Element, E = Event> extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {}
    interface BaseSyntheticEvent<E = object, C = any, T = any> {
      nativeEvent: E;
      currentTarget: C;
      target: T & {
        value?: string;
        name?: string;
        files?: FileList;
      };
      bubbles: boolean;
      cancelable: boolean;
      defaultPrevented: boolean;
      eventPhase: number;
      isTrusted: boolean;
      preventDefault(): void;
      isDefaultPrevented(): boolean;
      stopPropagation(): void;
      isPropagationStopped(): boolean;
      persist(): void;
      timeStamp: number;
      type: string;
    }

    // Component props types
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      className?: string;
      style?: CSSProperties;
      [key: string]: any;
    }
    
    interface ComponentProps<T extends ElementType> {
      [key: string]: any;
    }
    
    interface AriaAttributes {
      [key: string]: any;
    }
    
    interface DOMAttributes<T> {
      [key: string]: any;
    }
    
    interface CSSProperties {
      [key: string]: any;
    }
  }
}

export {};
