import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

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
  console.log("BusinessOwnerCard image_url:", image_url); // Debug log

  return (
    <div className="space-y-4">
      <Card className="p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              {image_url ? (
                <AvatarImage 
                  src={image_url} 
                  alt={name}
                  className="object-cover"
                  onError={(e) => {
                    console.error("Error loading owner image:", e);
                    e.currentTarget.src = ""; // Clear src on error
                  }}
                />
              ) : (
                <AvatarFallback className="text-4xl bg-primary/10">
                  <User className="h-12 w-12 text-primary" />
                </AvatarFallback>
              )}
            </Avatar>
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