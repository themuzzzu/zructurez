
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BusinessVerification } from "./BusinessVerification";

export const BusinessSettings = () => {
  const { data: businesses, isLoading } = useQuery({
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

  const handleShowInServicesChange = async (businessId: string, currentValue: boolean) => {
    const { error } = await supabase
      .from('businesses')
      .update({ show_in_services: !currentValue })
      .eq('id', businessId);

    if (error) {
      toast.error("Failed to update setting");
      return;
    }

    toast.success("Setting updated successfully");
  };

  if (isLoading) {
    return <div>Loading businesses...</div>;
  }

  if (!businesses?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You haven't created any businesses yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {businesses.map((business) => (
            <div key={business.id} className="space-y-4">
              <h3 className="font-semibold text-lg">{business.name}</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor={`show-in-services-${business.id}`}>Show in Services Page</Label>
                <Switch
                  id={`show-in-services-${business.id}`}
                  checked={business.show_in_services}
                  onCheckedChange={() => handleShowInServicesChange(business.id, business.show_in_services)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {businesses.map((business) => (
        <BusinessVerification key={business.id} businessId={business.id} />
      ))}
    </div>
  );
};
