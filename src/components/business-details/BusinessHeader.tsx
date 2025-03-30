
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          {isMobile ? (
            <Button variant="ghost" size="icon" onClick={handleBackClick}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <Link to="/businesses">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold">{name}</h1>
            <div className="flex items-center gap-2">
              <Badge variant={isOpen ? "success" : "destructive"} className="mt-1 sm:mt-0">
                {isOpen ? "Open" : "Closed"}
              </Badge>
              <div className="text-muted-foreground text-sm mt-1 sm:mt-0">{category}</div>
            </div>
          </div>
        </div>
        {isOwner && onEdit && (
          <Button onClick={onEdit} size={isMobile ? "sm" : "default"}>
            Edit
          </Button>
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
