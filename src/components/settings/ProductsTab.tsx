
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateProductForm } from "./CreateProductForm";
import { ProductsList } from "./ProductsList";
import { BusinessProductForm } from "./BusinessProductForm";
import { ServiceProductForm } from "./ServiceProductForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ProductsTab = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("marketplace");

  const { data: userBusinesses } = useQuery({
    queryKey: ['user-businesses'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id);

      return data || [];
    },
  });

  const { data: userServices } = useQuery({
    queryKey: ['user-services'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user.id);

      return data || [];
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="service">Service</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace">
          <ProductsList />
        </TabsContent>

        <TabsContent value="business">
          {userBusinesses?.map((business) => (
            <div key={business.id} className="mb-8">
              <h3 className="text-lg font-semibold mb-4">{business.name}</h3>
              <BusinessProductForm 
                businessId={business.id} 
                onSuccess={() => setIsDialogOpen(false)} 
              />
            </div>
          ))}
          {!userBusinesses?.length && (
            <p className="text-center text-muted-foreground py-8">
              You don't have any businesses yet. Create a business to add products.
            </p>
          )}
        </TabsContent>

        <TabsContent value="service">
          {userServices?.map((service) => (
            <div key={service.id} className="mb-8">
              <h3 className="text-lg font-semibold mb-4">{service.title}</h3>
              <ServiceProductForm 
                serviceId={service.id} 
                onSuccess={() => setIsDialogOpen(false)} 
              />
            </div>
          ))}
          {!userServices?.length && (
            <p className="text-center text-muted-foreground py-8">
              You don't have any services yet. Create a service to add products.
            </p>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-[90vh]">
          <ScrollArea className="h-full pr-4">
            <CreateProductForm onSuccess={() => setIsDialogOpen(false)} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};
