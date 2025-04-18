
/// <reference path="./component.d.ts" />
/// <reference path="./shadcn.d.ts" />

// Ensure components properly handle children props
declare module "@/components/ui/*" {
  interface BaseProps {
    children?: React.ReactNode;
    className?: string;
    asChild?: boolean;
  }

  // Dialog
  export interface DialogTitleProps extends BaseProps {}
  export interface DialogDescriptionProps extends BaseProps {}
  export interface DialogContentProps extends BaseProps {}
  export interface DialogHeaderProps extends BaseProps {}
  export interface DialogFooterProps extends BaseProps {}

  // Select
  export interface SelectTriggerProps extends BaseProps {}
  export interface SelectContentProps extends BaseProps {
    position?: "item" | "popper";
  }
  export interface SelectItemProps extends BaseProps {
    value: string;
  }
  export interface SelectValueProps extends BaseProps {
    placeholder?: string;
  }

  // ScrollArea
  export interface ScrollAreaProps extends BaseProps {}

  // Label
  export interface LabelProps extends BaseProps {
    htmlFor?: string;
  }
}

export {};
