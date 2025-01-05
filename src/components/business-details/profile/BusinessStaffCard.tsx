import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

interface BusinessStaffCardProps {
  name: string;
  position: string;
  experience?: string;
  image_url?: string | null;
}

export const BusinessStaffCard = ({
  name,
  position,
  experience,
  image_url,
}: BusinessStaffCardProps) => {
  console.log("BusinessStaffCard image_url:", image_url);

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <Avatar className="h-20 w-20">
          {image_url ? (
            <AvatarImage 
              src={image_url} 
              alt={name}
              className="object-cover"
              onError={(e) => {
                console.error("Error loading staff image:", e);
                e.currentTarget.src = ""; // Clear src on error
              }}
            />
          ) : (
            <AvatarFallback className="text-2xl bg-primary/10">
              <User className="h-8 w-8 text-primary" />
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1">
          <h4 className="text-xl font-semibold">{name}</h4>
          {position && (
            <div className="text-muted-foreground mt-1">{position}</div>
          )}
          {experience && (
            <div className="text-muted-foreground mt-2">
              Experience: {experience}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};