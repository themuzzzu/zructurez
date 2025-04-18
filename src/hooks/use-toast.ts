
// This file is needed because in src/components/ui/use-toast.ts it's imported from this path
import { toast } from 'sonner';

// Define the shape of our toast hook
type ToastProps = {
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success';
};

export const useToast = () => {
  const showToast = ({ title, description, action, variant = 'default' }: ToastProps) => {
    if (variant === 'destructive') {
      toast.error(title, {
        description,
        action,
      });
    } else if (variant === 'success') {
      toast.success(title, {
        description,
        action,
      });
    } else {
      toast(title, {
        description,
        action,
      });
    }
  };

  return { toast: showToast };
};

export { toast };
