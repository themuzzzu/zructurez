
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
    <div className="space-y-2 flex-1">
      {location && (
        <div className="flex items-start gap-2 text-sm text-white">
          <MapPin className="h-4 w-4 shrink-0 mt-1" />
          <div className="flex-1 relative break-words">
            <span className="inline-block pr-6 line-clamp-1">{location}</span>
            {location.length > 35 && (
              <div className="absolute top-0 right-0 bg-gradient-to-l from-zinc-900 to-transparent px-2">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      )}
      {hours && (
        <div className="flex items-start gap-2 text-sm text-white">
          <Clock className="h-4 w-4 shrink-0 mt-1" />
          <div className="flex-1 relative break-words">
            <span className="inline-block pr-6 line-clamp-1">{hours}</span>
            {hours.length > 35 && (
              <div className="absolute top-0 right-0 bg-gradient-to-l from-zinc-900 to-transparent px-2">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      )}
      {(appointment_price || consultation_price) && (
        <div className="flex flex-wrap gap-2 text-sm text-white mt-2">
          {appointment_price && (
            <div className="bg-zinc-800/40 rounded-full px-3 py-1 text-xs">
              <span className="font-medium">Appointment:</span> ₹{appointment_price}
            </div>
          )}
          {consultation_price && (
            <div className="bg-zinc-800/40 rounded-full px-3 py-1 text-xs">
              <span className="font-medium">Consultation:</span> ₹{consultation_price}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
