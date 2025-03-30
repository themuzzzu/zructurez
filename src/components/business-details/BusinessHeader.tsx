
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { BusinessStatus } from "./header/BusinessStatus";
import { TemporaryStatus } from "./header/TemporaryStatus";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col gap-3 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBackClick}
            className="transition-all hover:bg-muted mr-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <h1 className="text-lg sm:text-xl font-bold truncate">{name}</h1>
            <div className="flex items-center gap-2">
              <Badge variant={isOpen ? "success" : "destructive"} className="text-xs">
                {isOpen ? "Open" : "Closed"}
              </Badge>
              <div className="text-muted-foreground text-xs">{category}</div>
            </div>
          </div>
        </div>
        {isOwner && onEdit && (
          <Button 
            onClick={onEdit} 
            size="sm"
            className="animate-fade-in transition-all hover:scale-105"
          >
            Edit
          </Button>
        )}
      </div>

      {isOwner && (
        <div className="flex flex-wrap items-start gap-3 p-3 border rounded-lg bg-background animate-fade-in">
          <BusinessStatus id={id} initialIsOpen={isOpen} />
          <TemporaryStatus id={id} isOpen={isOpen} />
        </div>
      )}
    </div>
  );
};
