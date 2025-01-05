import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award } from "lucide-react";

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
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            {image_url ? (
              <AvatarImage src={image_url} alt={name} />
            ) : (
              <AvatarFallback>
                {name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h4 className="font-semibold">{name}</h4>
            <p className="text-sm text-muted-foreground">{position}</p>
          </div>
        </div>
      </div>
      {image_url && (
        <div className="relative aspect-square w-full">
          <img
            src={image_url}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {experience && (
        <div className="p-4">
          <div className="flex items-center gap-2 text-sm">
            <Award className="h-4 w-4" />
            <span>{experience}</span>
          </div>
        </div>
      )}
    </Card>
  );
};