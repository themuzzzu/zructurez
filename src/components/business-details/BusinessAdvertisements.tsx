import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BusinessAdvertisementsProps {
  businessId: string;
}

export const BusinessAdvertisements = ({ businessId }: BusinessAdvertisementsProps) => {
  // Don't make the query if businessId is not provided
  const { data: advertisements } = useQuery({
    queryKey: ['business-advertisements', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      
      const { data } = await supabase
        .from('advertisements')
        .select('*')
        .eq('business_id', businessId)
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString())
        .order('created_at', { ascending: false });
      return data || [];
    },
    // Only run the query if we have a valid businessId
    enabled: !!businessId,
  });

  if (!advertisements?.length) return null;

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-4 p-4 overflow-x-auto">
        {advertisements.map((ad) => (
          <Card key={ad.id} className="flex-shrink-0 w-[300px] overflow-hidden">
            {ad.image_url && (
              <img 
                src={ad.image_url} 
                alt={ad.title}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold mb-2">{ad.title}</h3>
              <p className="text-sm text-muted-foreground">{ad.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};