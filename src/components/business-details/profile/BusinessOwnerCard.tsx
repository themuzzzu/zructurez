import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface BusinessOwnerCardProps {
  name: string;
  role: string;
  position: string;
  experience?: string;
  image_url?: string | null;
}

export const BusinessOwnerCard = ({
  name,
  role,
  position,
  experience,
  image_url,
}: BusinessOwnerCardProps) => {
  console.log("Owner image URL:", image_url); // Debug log

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="h-12 w-12">
          <AvatarImage 
            src={image_url || undefined} 
            alt={name} 
          />
          <AvatarFallback>{name?.[0]?.toUpperCase() || 'O'}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold">{name}</h4>
          <div className="text-sm text-muted-foreground">{role}</div>
          {position && (
            <div className="text-sm text-muted-foreground">{position}</div>
          )}
          {experience && (
            <div className="text-sm text-muted-foreground">
              Experience: {experience}
            </div>
          )}
        </div>
      </div>
      {image_url && (
        <div className="w-full h-64 overflow-hidden rounded-md">
          <img
            src={image_url}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </Card>
  );
};