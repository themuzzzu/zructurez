
import { ReactNode } from 'react';

// Extend shadcn components to properly accept children props
declare module '@/components/ui/select' {
  interface SelectTriggerProps {
    children?: ReactNode;
    className?: string;
  }
  
  interface SelectContentProps {
    children?: ReactNode;
    className?: string;
  }
  
  interface SelectItemProps {
    children?: ReactNode;
    value: string;
    className?: string;
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
  }
}

declare module '@/components/ui/dialog' {
  interface DialogTitleProps {
    children?: ReactNode;
    className?: string;
  }
  
  interface DialogDescriptionProps {
    children?: ReactNode;
    className?: string;
  }
  
  interface DialogContentProps {
    children?: ReactNode;
    className?: string;
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

declare module '@/components/ui/label' {
  interface LabelProps {
    children?: ReactNode;
    htmlFor?: string;
    className?: string;
  }
}

// Add other shadcn component extensions as needed
