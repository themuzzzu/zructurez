
import { ReactNode } from "react";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Calendar, 
  Image, 
  FileText,
  Search, 
  AlertTriangle
} from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: "package" | "cart" | "users" | "calendar" | "image" | "file" | "search" | "warning";
  children?: ReactNode;
}

export function EmptyState({ 
  title, 
  description, 
  icon = "package", 
  children 
}: EmptyStateProps) {
  const icons = {
    package: <Package className="h-12 w-12 text-muted-foreground" />,
    cart: <ShoppingCart className="h-12 w-12 text-muted-foreground" />,
    users: <Users className="h-12 w-12 text-muted-foreground" />,
    calendar: <Calendar className="h-12 w-12 text-muted-foreground" />,
    image: <Image className="h-12 w-12 text-muted-foreground" />,
    file: <FileText className="h-12 w-12 text-muted-foreground" />,
    search: <Search className="h-12 w-12 text-muted-foreground" />,
    warning: <AlertTriangle className="h-12 w-12 text-muted-foreground" />,
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        {icons[icon]}
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
      {children}
    </div>
  );
}
