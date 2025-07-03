
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Business {
  id: string;
  name: string;
  image_url?: string;
}

export const AppointmentsTab = () => {
  const { data: businesses } = useQuery({
    queryKey: ["businesses"],
    queryFn: async (): Promise<Business[]> => {
      const { data, error } = await supabase
        .from("businesses")
        .select("id, name, image_url")
        .limit(10);

      if (error) throw error;
      return data || [];
    },
  });

  const { data: appointments } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          businesses!inner(name, image_url)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Your Appointments</h3>
        <p className="text-sm text-muted-foreground">
          View and manage your appointments
        </p>
      </div>

      {appointments && appointments.length > 0 ? (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{appointment.service_name}</span>
                  <Badge
                    variant={
                      appointment.status === "confirmed"
                        ? "default"
                        : appointment.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Business:</strong> {String(appointment.businesses?.name || 'Unknown')}
                  </p>
                  <p className="text-sm">
                    <strong>Date:</strong>{" "}
                    {new Date(appointment.appointment_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    <strong>Cost:</strong> ₹{appointment.cost}
                  </p>
                  {appointment.notes && (
                    <p className="text-sm">
                      <strong>Notes:</strong> {appointment.notes}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No appointments found
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
