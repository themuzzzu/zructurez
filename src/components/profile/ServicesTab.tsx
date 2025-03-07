
import { useState } from "react";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CreateServiceForm } from "@/components/CreateServiceForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ServicesTab = () => {
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);

  const { data: services, refetch: refetchServices } = useQuery({
    queryKey: ['user-services'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      return data || [];
    },
  });

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsServiceDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Service
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services?.map((service: any) => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-[90vh]">
          <ScrollArea className="h-full pr-4">
            <CreateServiceForm onClose={() => setIsServiceDialogOpen(false)} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};
