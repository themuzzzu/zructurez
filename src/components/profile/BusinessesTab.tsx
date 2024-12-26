import { useState } from "react";
import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CreateBusinessListing } from "@/components/CreateBusinessListing";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const BusinessesTab = () => {
  const [isBusinessDialogOpen, setIsBusinessDialogOpen] = useState(false);

  const { data: businesses, refetch: refetchBusinesses } = useQuery({
    queryKey: ['user-businesses'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      return data || [];
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
          <BusinessCard key={business.id} {...business} />
        ))}
      </div>
      <Dialog open={isBusinessDialogOpen} onOpenChange={setIsBusinessDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <CreateBusinessListing onClose={() => setIsBusinessDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};