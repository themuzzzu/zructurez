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
      <Card className="p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage 
                src={image_url || undefined} 
                alt={name}
              />
              <AvatarFallback className="text-2xl">{name?.[0]?.toUpperCase() || 'O'}</AvatarFallback>
            </Avatar>
            {image_url && (
              <div className="w-full max-w-[300px] aspect-square overflow-hidden rounded-lg">
                <img
                  src={image_url}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h4 className="text-2xl font-semibold">{name}</h4>
              <div className="text-lg text-muted-foreground">{role}</div>
            </div>
            
            <div className="space-y-2 text-muted-foreground">
              {position && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Position:</span>
                  <span>{position}</span>
                </div>
              )}
              {experience && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Experience:</span>
                  <span>{experience}</span>
                </div>
              )}
              {qualifications && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Qualifications:</span>
                  <span>{qualifications}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};