
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AdSlot } from "@/types/advertising";
import { Check, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AdSlotSelectorProps {
  slots: AdSlot[];
  selectedSlotId: string | null;
  onSelect: (id: string) => void;
  isLoading?: boolean;
}

export const AdSlotSelector = ({
  slots,
  selectedSlotId,
  onSelect,
  isLoading = false,
}: AdSlotSelectorProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-3 p-4 border rounded-md">
            <Skeleton className="h-12 w-12 rounded" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!slots.length) {
    return <p className="text-muted-foreground">No ad slots available.</p>;
  }

  // Group slots by type for better organization
  const groupedSlots: Record<string, AdSlot[]> = slots.reduce((acc, slot) => {
    const typeGroup = slot.type.split('_')[0] || 'other';
    if (!acc[typeGroup]) acc[typeGroup] = [];
    acc[typeGroup].push(slot);
    return acc;
  }, {} as Record<string, AdSlot[]>);

  // Order for display
  const groupOrder = ['homepage', 'sponsored', 'featured', 'trending', 'local', 'other'];

  const getGroupTitle = (key: string): string => {
    switch (key) {
      case 'homepage': return 'Homepage Banner Ads';
      case 'sponsored': return 'Sponsored Content Ads';
      case 'featured': return 'Featured Business Ads';
      case 'trending': return 'Trending Content Boosts';
      case 'local': return 'Local/City Ads';
      default: return 'Other Ad Types';
    }
  };

  return (
    <div className="space-y-6">
      {groupOrder.map((group) => {
        if (!groupedSlots[group]) return null;
        
        return (
          <div key={group} className="space-y-3">
            <h3 className="text-sm font-medium">{getGroupTitle(group)}</h3>
            <div className="grid grid-cols-1 gap-3">
              {groupedSlots[group].map((slot) => (
                <div
                  key={slot.id}
                  className={`flex items-start p-4 border rounded-md cursor-pointer transition-colors hover:bg-accent/50 ${
                    selectedSlotId === slot.id ? 'ring-1 ring-primary border-primary' : ''
                  }`}
                  onClick={() => onSelect(slot.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{slot.name}</h4>
                      {selectedSlotId === slot.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {slot.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <div className="bg-primary/10 text-primary rounded px-2 py-1">
                        ₹{slot.daily_price}/day
                      </div>
                      <div className="bg-primary/10 text-primary rounded px-2 py-1">
                        ₹{slot.monthly_price}/month
                      </div>
                      {slot.exclusive_price && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="bg-primary/10 text-primary rounded px-2 py-1 flex items-center gap-1">
                              Exclusive: ₹{slot.exclusive_price}
                              <Info className="h-3 w-3" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-xs">
                                Exclusive placement guarantees your ad will be the only one shown in this slot for the entire duration.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
