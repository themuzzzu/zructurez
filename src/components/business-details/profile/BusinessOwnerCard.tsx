import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface BusinessOwnerCardProps {
  name: string;
  role: string;
  position: string;
  experience?: string;
  qualifications?: string;
  image_url?: string | null;
}

export const BusinessOwnerCard = ({
  name,
  role,
  position,
  experience,
  qualifications,
  image_url,
}: BusinessOwnerCardProps) => {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-start gap-6">
          <Avatar className="h-16 w-16">
            <AvatarImage 
              src={image_url || undefined} 
              alt={name}
            />
            <AvatarFallback>{name?.[0]?.toUpperCase() || 'O'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <h4 className="text-xl font-semibold">{name}</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>{role}</div>
              {position && <div>{position}</div>}
              {experience && <div>Experience: {experience}</div>}
              {qualifications && <div>Qualifications: {qualifications}</div>}
            </div>
          </div>
        </div>
        {image_url && (
          <div className="mt-4">
            <div className="relative w-[300px] aspect-square overflow-hidden rounded-lg">
              <img
                src={image_url}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};