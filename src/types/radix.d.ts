
// Additional Radix UI type declarations to ensure children prop is supported
import { ReactNode } from 'react';

declare module '@radix-ui/react-dialog' {
  interface DialogProps {
    children?: ReactNode;
  }
  
  interface DialogContentProps {
    children?: ReactNode;
  }
  
  interface DialogTitleProps {
    children?: ReactNode;
  }
  
  interface DialogDescriptionProps {
    children?: ReactNode;
  }
}

declare module '@radix-ui/react-select' {
  interface SelectProps {
    children?: ReactNode;
  }
  
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

declare module '@radix-ui/react-scroll-area' {
  interface ScrollAreaProps {
    children?: ReactNode;
  }
}

declare module '@radix-ui/react-label' {
  interface LabelProps {
    children?: ReactNode;
  }
}
