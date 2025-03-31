
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ServiceCard } from "@/components/service-card/ServiceCard";
import { CreateServiceForm } from "@/components/service-form/CreateServiceForm";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/common/Spinner";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userServices, setUserServices] = useState([]);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkUserAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setIsUserLoggedIn(!!data.user);
      
      if (data.user) {
        fetchUserServices(data.user.id);
      }
    };
    
    const fetchServices = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(12);
          
        if (error) throw error;
        setServices(data || []);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchUserServices = async (userId) => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setUserServices(data || []);
      } catch (err) {
        console.error('Error fetching user services:', err);
      }
    };
    
    checkUserAuth();
    fetchServices();
  }, []);
  
  const handleCreateSuccess = () => {
    setIsDialogOpen(false);
    window.location.reload(); // Refresh to see new service
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Services</h1>
        {isUserLoggedIn && (
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Service
          </Button>
        )}
      </div>
      
      {isUserLoggedIn && userServices.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Your Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userServices.map((service) => (
              <ServiceCard 
                key={service.id}
                id={service.id}
                title={service.title}
                description={service.description}
                image_url={service.image_url}
                price={service.price}
                providerName="You"
                providerId={service.user_id}
                category={service.category}
                location={service.location}
              />
            ))}
          </div>
        </div>
      )}
      
      <h2 className="text-2xl font-semibold mb-4">All Services</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard 
              key={service.id}
              id={service.id}
              title={service.title}
              description={service.description}
              image_url={service.image_url}
              price={service.price}
              providerId={service.user_id}
              category={service.category}
              location={service.location}
              views={service.views}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No services found</p>
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Create a New Service</h2>
          <CreateServiceForm onSuccess={handleCreateSuccess} onCancel={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
