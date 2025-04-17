
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

  // Add React namespace definition
  namespace React {
    interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
      type: T;
      props: P;
      key: Key | null;
    }

    type JSXElementConstructor<P> = ((props: P) => ReactElement | null) | (new (props: P) => Component<P, any>);
    type Key = string | number;

    interface FormEvent<T = Element> extends SyntheticEvent<T> {}
    interface ChangeEvent<T = Element> extends SyntheticEvent<T> {}
    interface MouseEvent<T = Element, E = NativeMouseEvent> extends SyntheticEvent<T, E> {}
    interface KeyboardEvent<T = Element> extends SyntheticEvent<T> {}
    
    interface SyntheticEvent<T = Element, E = Event> extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {}
    interface BaseSyntheticEvent<E = object, C = any, T = any> {
      nativeEvent: E;
      currentTarget: C;
      target: T;
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
  }
}

export {};
