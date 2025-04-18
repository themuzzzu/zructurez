
import { LucideIcon } from 'lucide-react';
import { ComponentType, ForwardRefExoticComponent, RefAttributes } from 'react';

export type IconComponent = LucideIcon | ComponentType<{ className?: string }>;

// Add a more flexible type that includes ForwardRefExoticComponent
declare global {
  namespace React {
    // This extends the existing ElementType to handle ForwardRefExoticComponent
    interface ElementType<P = any> {
      (props: P): React.ReactElement<any, any> | null;
      displayName?: string;
    }
  }
}
