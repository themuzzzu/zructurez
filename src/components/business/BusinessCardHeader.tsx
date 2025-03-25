
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronDown, CheckCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

const getStatusDetails = (is_open?: boolean, wait_time?: string, closure_reason?: string) => {
  if (is_open === undefined) return null;
  
  if (is_open) {
    return {
      label: "Open",
      variant: "success",
      tooltip: "This business is currently open"
    };
  } else if (wait_time) {
    return {
      label: "Temporarily Unavailable",
      variant: "destructive",
      tooltip: `Available in ${wait_time}${closure_reason ? ` (${getReasonLabel(closure_reason)})` : ''}`
    };
  } else {
    return {
      label: "Closed",
      variant: "destructive",
      tooltip: "This business is currently closed"
    };
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
  const statusDetails = getStatusDetails(is_open, wait_time, closure_reason);
  
  return (
    <div className="space-y-2">
      <div className="relative">
        <h3 className="font-semibold text-xl pr-8">{name}</h3>
        {name.length > 25 && (
          <div className="absolute top-1/2 right-0 -translate-y-1/2 bg-gradient-to-l from-black/95 dark:from-black/95 to-transparent px-2">
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-1">
        <span className="text-sm text-gray-300">{category}</span>
        <div className="flex flex-wrap items-center gap-2">
          {statusDetails && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Badge 
                      variant={statusDetails.variant as any}
                      className="text-xs px-2 py-0.5 transition-all duration-300 animate-pulse"
                    >
                      {statusDetails.label}
                    </Badge>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{statusDetails.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {verified && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Badge variant="outline" className="text-xs px-2 py-0.5 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-blue-500" />
                      Verified
                    </Badge>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This business has been verified</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
