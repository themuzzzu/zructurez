import { useState } from "react";
import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CreateBusinessListing } from "@/components/CreateBusinessListing";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

export const BusinessesTab = () => {
  const [isBusinessDialogOpen, setIsBusinessDialogOpen] = useState(false);

  const { data: businesses, refetch: refetchBusinesses } = useQuery({
    queryKey: ['user-businesses'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching businesses:', error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error('Error in business query:', error);
        return [];
      }
    },
  });

  const handleBusinessSuccess = () => {
    setIsBusinessDialogOpen(false);
    refetchBusinesses();
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsBusinessDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Business
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {businesses?.map((business: any) => (
          <div key={business.id} className="w-full">
            <div className="aspect-[3/4] w-full">
              <BusinessCard {...business} />
            </div>
          </div>
        ))}
      </div>
      <Dialog open={isBusinessDialogOpen} onOpenChange={setIsBusinessDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-[90vh]">
          <ScrollArea className="h-full pr-4">
            <CreateBusinessListing onClose={() => setIsBusinessDialogOpen(false)} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};