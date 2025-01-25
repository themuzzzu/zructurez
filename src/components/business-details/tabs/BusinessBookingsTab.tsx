import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, DollarSign, FileText, User } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

interface BusinessBookingsTabProps {
  businessId: string;
}

interface Appointment {
  id: string;
  user_id: string;
  appointment_date: string;
  service_name: string;
  cost: number;
  status: string;
  notes?: string | null;
  profiles: {
    username: string | null;
  } | null;
}

export const BusinessBookingsTab = ({ businessId }: BusinessBookingsTabProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['business-appointments', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          profiles:user_id (
            username
          )
        `)
        .eq('business_id', businessId)
        .order('appointment_date', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }
      return data as Appointment[];
    },
  });

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

  // Filter appointments for selected date
  const filteredAppointments = appointments?.filter(appointment => {
    if (!selectedDate) return true;
    const appointmentDate = new Date(appointment.appointment_date);
    return (
      appointmentDate.getDate() === selectedDate.getDate() &&
      appointmentDate.getMonth() === selectedDate.getMonth() &&
      appointmentDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Get dates with appointments for calendar highlighting
  const datesWithAppointments = appointments?.map(
    appointment => new Date(appointment.appointment_date)
  );

  if (isLoading) {
    return <div>Loading appointments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        <Card className="p-4 flex-1">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              booked: datesWithAppointments || [],
            }}
            modifiersStyles={{
              booked: {
                fontWeight: 'bold',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
              }
            }}
          />
        </Card>
        
        <div className="space-y-4 flex-[2]">
          {!filteredAppointments?.length ? (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">
                No appointments found for {selectedDate ? format(selectedDate, 'PPP') : 'selected date'}
              </p>
            </Card>
          ) : (
            filteredAppointments.map((appointment) => (
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
                      <User className="h-4 w-4" />
                      <span>
                        {appointment.profiles?.username || 'Anonymous User'}
                      </span>
                    </div>

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
            ))
          )}
        </div>
      </div>
    </div>
  );
};