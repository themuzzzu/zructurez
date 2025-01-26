import { Badge } from "@/components/ui/badge";
import { Clock, ChevronDown } from "lucide-react";

interface BusinessCardHeaderProps {
  name: string;
  category: string;
  is_open?: boolean;
  verified: boolean;
  wait_time?: string;
  closure_reason?: string;
}

const getReasonLabel = (reason?: string) => {
  if (!reason) return '';
  switch (reason) {
    case 'food_break':
      return 'Food Break';
    case 'sick':
      return 'Sick Leave';
    case 'holiday':
      return 'Holiday';
    case 'next_day':
      return 'Available Next Day';
    case 'other':
      return 'Other';
    default:
      return '';
  }
};

export const BusinessCardHeader = ({
  name,
  category,
  is_open,
  verified,
  wait_time,
  closure_reason
}: BusinessCardHeaderProps) => {
  return (
    <div className="space-y-2">
      <div className="relative">
        <h3 className="font-semibold text-xl pr-8">{name}</h3>
        {name.length > 25 && (
          <div className="absolute top-1/2 right-0 -translate-y-1/2 bg-gradient-to-l from-black/95 to-transparent px-2">
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-1">
        <span className="text-sm text-gray-300">{category}</span>
        <div className="flex items-center gap-2">
          {typeof is_open === 'boolean' && (
            <Badge 
              variant={is_open ? "success" : "destructive"}
              className="text-xs px-2 py-0.5"
            >
              {is_open ? "Open" : "Closed"}
            </Badge>
          )}
          {verified && (
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              Verified
            </Badge>
          )}
        </div>
        {!is_open && wait_time && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Clock className="h-4 w-4" />
            <span>Available in {wait_time}</span>
            {closure_reason && (
              <span className="text-gray-400">({getReasonLabel(closure_reason)})</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};