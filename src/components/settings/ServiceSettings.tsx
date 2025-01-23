import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ServiceSettings = () => {
  const { data: services, isLoading } = useQuery({
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

  if (isLoading) {
    return <div>Loading services...</div>;
  }

  if (!services?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Service Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You haven't created any services yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {services.map((service) => (
          <div key={service.id} className="space-y-4">
            <h3 className="font-semibold text-lg">{service.title}</h3>
            <div className="space-y-2">
              <div>
                <Label>Price</Label>
                <p className="text-muted-foreground">₹{service.price}</p>
              </div>
              <div>
                <Label>Location</Label>
                <p className="text-muted-foreground">{service.location || "Not specified"}</p>
              </div>
              <div>
                <Label>Availability</Label>
                <p className="text-muted-foreground">{service.availability || "Not specified"}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};