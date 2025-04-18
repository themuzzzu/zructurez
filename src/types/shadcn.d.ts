
import { ReactNode } from 'react';

declare module '@/components/ui/dialog' {
  export interface DialogTitleProps {
    children?: ReactNode;
    className?: string;
    asChild?: boolean;
  }
  
  export interface DialogDescriptionProps {
    children?: ReactNode;
    className?: string;
    asChild?: boolean;
  }
  
  export interface DialogContentProps {
    children?: ReactNode;
    className?: string;
    asChild?: boolean;
  }
  
  export interface DialogHeaderProps {
    children?: ReactNode;
    className?: string;
  }
  
  export interface DialogFooterProps {
    children?: ReactNode;
    className?: string;
  }
}

declare module '@/components/ui/select' {
  export interface SelectTriggerProps {
    children?: ReactNode;
    className?: string;
    asChild?: boolean;
  }
  
  export interface SelectContentProps {
    children?: ReactNode;
    className?: string;
    position?: "item" | "popper";
    asChild?: boolean;
  }
  
  export interface SelectItemProps {
    children?: ReactNode;
    value: string;
    className?: string;
    key?: string;
    asChild?: boolean;
  }
  
  export interface SelectValueProps {
    children?: ReactNode;
    placeholder?: string;
  }
}

declare module '@/components/ui/scroll-area' {
  export interface ScrollAreaProps {
    children?: ReactNode;
    className?: string;
    asChild?: boolean;
  }
}

declare module '@/components/ui/label' {
  export interface LabelProps {
    children?: ReactNode;
    htmlFor?: string;
    className?: string;
    asChild?: boolean;
  }
}
