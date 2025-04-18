
import { ReactNode } from 'react';

// Create a base interface for any component that might accept children
interface WithChildren {
  children?: ReactNode;
}

// Extend shadcn components to properly accept children props
declare module '@/components/ui/dialog' {
  interface DialogTitleProps extends WithChildren {
    className?: string;
  }
  
  interface DialogDescriptionProps extends WithChildren {
    className?: string;
  }
  
  interface DialogContentProps extends WithChildren {
    className?: string;
  }
  
  interface DialogHeaderProps extends WithChildren {
    className?: string;
  }
  
  interface DialogFooterProps extends WithChildren {
    className?: string;
  }
}

declare module '@/components/ui/select' {
  interface SelectTriggerProps extends WithChildren {
    className?: string;
  }
  
  interface SelectContentProps extends WithChildren {
    className?: string;
  }
  
  interface SelectItemProps extends WithChildren {
    value: string;
    className?: string;
    key?: string;
  }
  
  interface SelectValueProps extends WithChildren {
    placeholder?: string;
  }
}

declare module '@/components/ui/scroll-area' {
  interface ScrollAreaProps extends WithChildren {
    className?: string;
  }
}

declare module '@/components/ui/label' {
  interface LabelProps extends WithChildren {
    htmlFor?: string;
    className?: string;
  }
}
