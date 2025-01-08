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
    <div className="space-y-4">
      <Card className="p-8">
        <div className="flex gap-8">
          {/* Text Content */}
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

          {/* Image Section */}
          {image_url && (
            <div className="w-1/3 min-w-[200px]">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                <img
                  src={image_url}
                  alt={`${name}'s profile`}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};