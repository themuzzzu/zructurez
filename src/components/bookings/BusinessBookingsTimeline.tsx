
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookingCard } from "./BookingCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { format, isSameDay, isAfter, isBefore, startOfToday } from "date-fns";

interface BusinessBookingsTimelineProps {
  businessId: string;
}

type Booking = {
  id: string;
  user_id: string;
  business_id: string;
  service_name: string;
  appointment_date: string;
  status: string;
  notes?: string | null;
  created_at: string;
  profile?: {
    username: string;
    avatar_url?: string;
  } | null;
};

export const BusinessBookingsTimeline: React.FC<BusinessBookingsTimelineProps> = ({ 
  businessId 
}) => {
  const [filter, setFilter] = useState<"today" | "upcoming" | "past" | "all">("all");
  
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["business-bookings", businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq("business_id", businessId)
        .order("appointment_date", { ascending: true });
      
      if (error) {
        console.error("Error fetching appointments:", error);
        throw error;
      }
      
      return data as Booking[];
    },
  });
  
  const filteredBookings = React.useMemo(() => {
    if (!bookings) return [];
    
    const today = startOfToday();
    
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.appointment_date);
      
      switch (filter) {
        case "today":
          return isSameDay(bookingDate, today);
        case "upcoming":
          return isAfter(bookingDate, today);
        case "past":
          return isBefore(bookingDate, today);
        default:
          return true;
      }
    });
  }, [bookings, filter]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Bookings</CardTitle>
        <CardDescription>
          View and manage all your appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setFilter(value as any)}>
          <TabsList className="mb-4 w-full sm:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <p>Loading bookings...</p>
            ) : filteredBookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                No bookings found
              </p>
            ) : (
              filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  id={booking.id}
                  userName={booking.profile?.username || "Anonymous User"}
                  serviceName={booking.service_name}
                  appointmentDate={booking.appointment_date}
                  createdAt={booking.created_at}
                  status={booking.status}
                  notes={booking.notes}
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="today" className="space-y-4">
            {isLoading ? (
              <p>Loading bookings...</p>
            ) : filteredBookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                No bookings scheduled for today
              </p>
            ) : (
              filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  id={booking.id}
                  userName={booking.profile?.username || "Anonymous User"}
                  serviceName={booking.service_name}
                  appointmentDate={booking.appointment_date}
                  createdAt={booking.created_at}
                  status={booking.status}
                  notes={booking.notes}
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-4">
            {isLoading ? (
              <p>Loading bookings...</p>
            ) : filteredBookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                No upcoming bookings
              </p>
            ) : (
              filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  id={booking.id}
                  userName={booking.profile?.username || "Anonymous User"}
                  serviceName={booking.service_name}
                  appointmentDate={booking.appointment_date}
                  createdAt={booking.created_at}
                  status={booking.status}
                  notes={booking.notes}
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            {isLoading ? (
              <p>Loading bookings...</p>
            ) : filteredBookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                No past bookings
              </p>
            ) : (
              filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  id={booking.id}
                  userName={booking.profile?.username || "Anonymous User"}
                  serviceName={booking.service_name}
                  appointmentDate={booking.appointment_date}
                  createdAt={booking.created_at}
                  status={booking.status}
                  notes={booking.notes}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
