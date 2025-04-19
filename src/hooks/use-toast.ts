
import { toast as sonnerToast } from 'sonner';

// Define the shape of our toast hook
type ToastProps = {
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number; // Added duration property
};

export const useToast = () => {
  const showToast = ({ title, description, action, variant = 'default', duration }: ToastProps) => {
    const options: any = {
      description,
      action,
      duration,
    };

    if (variant === 'destructive') {
      sonnerToast.error(title, options);
    } else if (variant === 'success') {
      sonnerToast.success(title, options);
    } else {
      sonnerToast(title, options);
    }
  };

  return { toast: showToast, toasts: [] }; // Added empty toasts array for compatibility
};

export { sonnerToast as toast };
