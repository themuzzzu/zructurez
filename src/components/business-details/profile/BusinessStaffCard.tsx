import { Card } from "@/components/ui/card";

interface BusinessStaffCardProps {
  name: string;
  position: string;
  experience?: string;
  bio?: string;
}

export const BusinessStaffCard = ({
  name,
  position,
  experience,
  bio,
}: BusinessStaffCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-2">
        <h4 className="text-xl font-semibold">{name}</h4>
        {position && (
          <div className="text-muted-foreground">{position}</div>
        )}
        {experience && (
          <div className="text-muted-foreground">
            Experience: {experience}
          </div>
        )}
        {bio && (
          <div className="text-muted-foreground mt-2">
            <p className="text-sm leading-relaxed">{bio}</p>
          </div>
        )}
      </div>
    </Card>
  );
};