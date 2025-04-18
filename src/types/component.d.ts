
import { LucideIcon } from 'lucide-react';
import { ComponentType, ElementType } from 'react';

declare module 'react' {
  // Extend ElementType to properly handle Radix and Lucide components
  export interface ElementType<P = any> {
    (props: P): React.ReactElement<any, any> | null;
    displayName?: string;
  }
}

// Type for Lucide icons to be used in components
export type IconComponent = LucideIcon | ComponentType<{ className?: string }>;
