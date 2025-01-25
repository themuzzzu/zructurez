import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, DollarSign, FileText } from "lucide-react";

interface BusinessBookingsTabProps {
  businessId: string;
}

export const BusinessBookingsTab = ({ businessId }: BusinessBookingsTabProps) => {
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['business-appointments', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('business_id', businessId)
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading appointments...</div>;
  }

  if (!appointments?.length) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">No appointments found</p>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id} className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{appointment.service_name}</h3>
              <Badge className={getStatusColor(appointment.status)}>
                {appointment.status}
              </Badge>
            </div>
            
            <div className="grid gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>
                  {format(new Date(appointment.appointment_date), 'PPP')}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  {format(new Date(appointment.appointment_date), 'p')}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>${appointment.cost}</span>
              </div>
              
              {appointment.notes && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{appointment.notes}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};