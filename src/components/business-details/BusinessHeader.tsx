
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { BusinessStatus } from "./header/BusinessStatus";
import { TemporaryStatus } from "./header/TemporaryStatus";

interface BusinessHeaderProps {
  id: string;
  name: string;
  category: string;
  isOwner: boolean;
  isOpen?: boolean;
  onEdit?: () => void;
}

export const BusinessHeader = ({ 
  id, 
  name, 
  category, 
  isOwner, 
  isOpen = true,
  onEdit 
}: BusinessHeaderProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/businesses">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{name}</h1>
            <Badge variant={isOpen ? "success" : "destructive"}>
              {isOpen ? "Open" : "Closed"}
            </Badge>
          </div>
          <div className="text-muted-foreground">{category}</div>
        </div>
        {isOwner && onEdit && (
          <Button onClick={onEdit}>Edit Business</Button>
        )}
      </div>

      {isOwner && (
        <div className="flex flex-wrap items-start gap-6 p-4 border rounded-lg bg-background">
          <BusinessStatus id={id} initialIsOpen={isOpen} />
          <TemporaryStatus id={id} isOpen={isOpen} />
        </div>
      )}
    </div>
  );
};
