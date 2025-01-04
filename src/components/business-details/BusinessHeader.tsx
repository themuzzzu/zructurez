import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface BusinessHeaderProps {
  name: string;
  category: string;
  isOwner: boolean;
  onEdit?: () => void;
}

export const BusinessHeader = ({ name, category, isOwner, onEdit }: BusinessHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Link to="/business">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{name}</h1>
          <div className="text-muted-foreground">{category}</div>
        </div>
      </div>
      {isOwner && onEdit && (
        <Button onClick={onEdit}>Edit Business</Button>
      )}
    </div>
  );
};