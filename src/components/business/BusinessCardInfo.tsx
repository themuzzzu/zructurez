import { MapPin, Clock, ChevronDown } from "lucide-react";

interface BusinessCardInfoProps {
  location: string;
  hours: string;
  appointment_price?: number;
  consultation_price?: number;
}

export const BusinessCardInfo = ({
  location,
  hours,
  appointment_price,
  consultation_price
}: BusinessCardInfoProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2 text-sm text-gray-300">
        <MapPin className="h-4 w-4 shrink-0 mt-1" />
        <div className="flex-1 relative">
          <span className="inline-block pr-6">{location}</span>
          {location.length > 35 && (
            <div className="absolute top-0 right-0 bg-gradient-to-l from-black/95 to-transparent px-2">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-start gap-2 text-sm text-gray-300">
        <Clock className="h-4 w-4 shrink-0 mt-1" />
        <div className="flex-1 relative">
          <span className="inline-block pr-6">{hours}</span>
          {hours.length > 35 && (
            <div className="absolute top-0 right-0 bg-gradient-to-l from-black/95 to-transparent px-2">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>
      </div>
      {(appointment_price || consultation_price) && (
        <div className="space-y-1 text-sm text-gray-300">
          {appointment_price && (
            <div>
              <span className="font-medium">Appointment:</span> ₹{appointment_price}
            </div>
          )}
          {consultation_price && (
            <div>
              <span className="font-medium">Consultation:</span> ₹{consultation_price}
            </div>
          )}
        </div>
      )}
    </div>
  );
};