
import { ReactNode } from 'react';

declare module '@/components/ui/dialog' {
  interface DialogTitleProps {
    children?: ReactNode;
    className?: string;
    asChild?: boolean;
  }
  
  interface DialogDescriptionProps {
    children?: ReactNode;
    className?: string;
    asChild?: boolean;
  }
  
  interface DialogContentProps {
    children?: ReactNode;
    className?: string;
    asChild?: boolean;
  }
  
  interface DialogHeaderProps {
    children?: ReactNode;
    className?: string;
  }
  
  interface DialogFooterProps {
    children?: ReactNode;
    className?: string;
  }
}

declare module '@/components/ui/select' {
  interface SelectTriggerProps {
    children?: ReactNode;
    className?: string;
    asChild?: boolean;
  }
  
  interface SelectContentProps {
    children?: ReactNode;
    className?: string;
    position?: "item" | "popper";
    asChild?: boolean;
  }
  
  interface SelectItemProps {
    children?: ReactNode;
    value: string;
    className?: string;
    key?: string;
    asChild?: boolean;
  }
  
  interface SelectValueProps {
    children?: ReactNode;
    placeholder?: string;
  }
}

declare module '@/components/ui/scroll-area' {
  interface ScrollAreaProps {
    children?: ReactNode;
    className?: string;
    asChild?: boolean;
  }
}

declare module '@/components/ui/label' {
  interface LabelProps {
    children?: ReactNode;
    htmlFor?: string;
    className?: string;
    asChild?: boolean;
  }
}
