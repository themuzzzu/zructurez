
import { toast as sonnerToast } from "sonner";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

export const useToast = () => {
  const toast = ({ title, description, variant }: ToastProps) => {
    if (variant === "destructive") {
      sonnerToast.error(title || description || "An error occurred");
    } else {
      sonnerToast.success(title || description || "Success");
    }
  };

  return { toast };
};

export { sonnerToast as toast };
