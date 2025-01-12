import { Card } from "@/components/ui/card";

interface BusinessOwnerCardProps {
  name: string;
  role: string;
  position: string;
  experience?: string;
  qualifications?: string;
  bio?: string;
  image_url?: string | null;
}

export const BusinessOwnerCard = ({
  name,
  role,
  position,
  experience,
  qualifications,
  bio,
  image_url,
}: BusinessOwnerCardProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Image Card with Overlay */}
      <Card className="relative aspect-[4/3] overflow-hidden group cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />
        {image_url ? (
          <img
            src={image_url}
            alt={`${name}'s profile`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image available</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20">
          <h4 className="text-xl font-semibold">{name}</h4>
          <p className="text-sm opacity-90">{role}</p>
          <p className="text-sm opacity-90">{position}</p>
        </div>
      </Card>

      {/* Details Card */}
      <Card className="p-4 bg-muted/50">
        <div className="space-y-3">
          {experience && (
            <div>
              <span className="font-medium">Experience:</span>
              <span className="ml-2 text-muted-foreground">{experience}</span>
            </div>
          )}
          {qualifications && (
            <div>
              <span className="font-medium">Qualifications:</span>
              <span className="ml-2 text-muted-foreground">{qualifications}</span>
            </div>
          )}
          {bio && (
            <div>
              <span className="font-medium">Bio:</span>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{bio}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};