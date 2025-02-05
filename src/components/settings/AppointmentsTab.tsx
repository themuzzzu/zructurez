
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Database } from "@/integrations/supabase/types";

type Appointment = Database['public']['Tables']['appointments']['Row'] & {
  businesses: Pick<Database['public']['Tables']['businesses']['Row'], 'name' | 'image_url'> | null;
};

export const AppointmentsTab = () => {
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['user-appointments'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          businesses:business_id(
            name,
            image_url
          )
        `)
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
        return [];
      }

      return data as Appointment[];
    },
  });

  if (isLoading) {
    return <div>Loading appointments...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-yellow-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Appointments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {appointments?.length === 0 ? (
          <p className="text-muted-foreground">No appointments found.</p>
        ) : (
          appointments?.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                {appointment.businesses?.image_url && (
                  <img
                    src={appointment.businesses.image_url}
                    alt={appointment.businesses?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{appointment.businesses?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(appointment.appointment_date), 'PPp')}
                  </p>
                  <p className="text-sm">{appointment.service_name}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={getStatusColor(appointment.status)}>
                  {appointment.status}
                </Badge>
                <p className="text-sm font-semibold">₹{appointment.cost}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
