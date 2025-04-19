
import { ReactNode } from 'react';

// Define components with explicit children support
declare module '@/components/ui/dialog' {
  export interface DialogProps {
    children?: ReactNode;
  }
  
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
  export interface SelectProps {
    children?: ReactNode;
  }
  
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

declare module '@/components/ui/alert-dialog' {
  export interface AlertDialogProps {
    children?: ReactNode;
  }
  
  export interface AlertDialogTitleProps {
    children?: ReactNode;
    className?: string;
  }
  
  export interface AlertDialogDescriptionProps {
    children?: ReactNode;
    className?: string;
  }
  
  export interface AlertDialogContentProps {
    children?: ReactNode;
    className?: string;
  }
}
