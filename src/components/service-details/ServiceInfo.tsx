import { Card } from "@/components/ui/card";
import { MapPin, Clock } from "lucide-react";

interface ServiceInfoProps {
  description: string;
  location?: string;
  availability?: string;
  imageUrl?: string;
}

export const ServiceInfo = ({ description, location, availability, imageUrl }: ServiceInfoProps) => {
  return (
    <div className="space-y-6">
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Service"
          className="w-full h-[400px] object-cover rounded-lg"
        />
      )}

      <Card className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold">About this service</h2>
        <p className="text-muted-foreground">{description}</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {location || "Location not specified"}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {availability || "Availability not specified"}
          </div>
        </div>
      </Card>
    </div>
  );
};