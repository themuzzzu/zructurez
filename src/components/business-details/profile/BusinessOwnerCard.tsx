import { Card } from "@/components/ui/card";

interface BusinessOwnerCardProps {
  name: string;
  role: string;
  position: string;
  experience?: string;
  qualifications?: string;
  bio?: string;
}

export const BusinessOwnerCard = ({
  name,
  role,
  position,
  experience,
  qualifications,
  bio,
}: BusinessOwnerCardProps) => {
  return (
    <div className="space-y-4">
      <Card className="p-8">
        <div className="flex flex-col gap-8">
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
              {bio && (
                <div className="flex flex-col gap-2 mt-4">
                  <span className="font-medium">Bio:</span>
                  <p className="text-sm leading-relaxed">{bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};