import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { ServiceCard } from "@/components/service-card/ServiceCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateServiceForm } from "@/components/service-form/CreateServiceForm";

export default function Services() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: services, isLoading, isError } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*');

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });

  const handleCreateService = () => {
    setIsDialogOpen(true);
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Services</h1>
          <Button onClick={handleCreateService}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>

        {isLoading ? (
          <p>Loading services...</p>
        ) : isError ? (
          <p>Error loading services.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services?.map((service) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                title={service.name}
                providerId={service.provider}
                providerName={service.provider}
                providerAvatar={service.avatar}
                category={service.category}
                rating={service.rating}
                reviews={service.reviews}
                description={service.description}
                image={service.image}
                hourlyRate={service.hourlyRate}
                location={service.location}
                tags={service.tags}
                isFeatured={service.isFeatured}
                isRecommended={service.isRecommended}
                isPopular={service.isPopular}
                views={service.views}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-[90vh]">
          <DialogHeader>
            <DialogTitle>Create a New Service</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new service.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-full pr-4">
            <CreateServiceForm onSuccess={() => setIsDialogOpen(false)} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
