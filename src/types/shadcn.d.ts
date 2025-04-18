
import { ReactNode } from 'react';

// Extend shadcn components to properly accept children props
declare module '@/components/ui/select' {
  interface SelectTriggerProps {
    children?: ReactNode;
  }
  
  interface SelectContentProps {
    children?: ReactNode;
  }
  
  interface SelectItemProps {
    children?: ReactNode;
  }
}

declare module '@/components/ui/scroll-area' {
  interface ScrollAreaProps {
    children?: ReactNode;
  }
}

declare module '@/components/ui/dialog' {
  interface DialogTitleProps {
    children?: ReactNode;
  }
  
  interface DialogDescriptionProps {
    children?: ReactNode;
  }
}

// Add other shadcn component extensions as needed
