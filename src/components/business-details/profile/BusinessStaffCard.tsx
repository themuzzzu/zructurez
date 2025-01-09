import { Card } from "@/components/ui/card";

interface BusinessStaffCardProps {
  name: string;
  position: string;
  experience?: string;
  bio?: string;
  image_url?: string | null;
}

export const BusinessStaffCard = ({
  name,
  position,
  experience,
  bio,
  image_url,
}: BusinessStaffCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Details Card */}
      <Card className="p-6 bg-muted/50">
        <div className="space-y-4">
          <div>
            <h4 className="text-xl font-semibold">{name}</h4>
            {position && (
              <div className="text-muted-foreground">{position}</div>
            )}
          </div>
          {experience && (
            <div className="text-muted-foreground">
              <span className="font-medium">Experience:</span> {experience}
            </div>
          )}
          {bio && (
            <div className="text-muted-foreground mt-2">
              <span className="font-medium">Bio:</span>
              <p className="text-sm leading-relaxed mt-1">{bio}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Image Card */}
      {image_url ? (
        <Card className="aspect-square overflow-hidden">
          <img
            src={image_url}
            alt={`${name}'s profile`}
            className="w-full h-full object-cover"
          />
        </Card>
      ) : (
        <Card className="aspect-square bg-muted/50 flex items-center justify-center">
          <div className="text-muted-foreground">No image available</div>
        </Card>
      )}
    </div>
  );
};