
import { LucideIcon } from 'lucide-react';
import { ComponentType, ElementType, ForwardRefExoticComponent, RefAttributes } from 'react';

declare module 'react' {
  export interface ElementType<P = any> extends ForwardRefExoticComponent<P> {
    (props: P): React.ReactElement<any, any> | null;
    displayName?: string;
  }
}

export type IconComponent = LucideIcon | ComponentType<{ className?: string }>;

