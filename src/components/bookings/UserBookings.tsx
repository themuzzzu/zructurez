
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookingCard } from "./BookingCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { format, isAfter, isBefore, startOfToday, addHours } from "date-fns";
import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserBookingsProps {
  userId: string;
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
  businesses?: {
    name: string;
  } | null;
};

export const UserBookings: React.FC<UserBookingsProps> = ({ userId }) => {
  const [filter, setFilter] = useState<"upcoming" | "past" | "all">("all");
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["user-bookings", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          businesses (
            name
          )
        `)
        .eq("user_id", userId)
        .order("appointment_date", { ascending: true });
      
      if (error) {
        console.error("Error fetching appointments:", error);
        throw error;
      }
      
      return data as Booking[];
    },
  });
  
  const cancelBooking = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", bookingId);
      
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["user-bookings", userId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to cancel booking: " + error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleCancelBooking = (booking: Booking) => {
    setBookingToCancel(booking);
  };
  
  const confirmCancelBooking = () => {
    if (bookingToCancel) {
      cancelBooking.mutate(bookingToCancel.id);
      setBookingToCancel(null);
    }
  };
  
  const canCancelBooking = (appointmentDate: string) => {
    // Only allow cancellation if booking is at least 24 hours away
    const bookingTime = new Date(appointmentDate);
    const cancellationDeadline = addHours(new Date(), 24);
    return isAfter(bookingTime, cancellationDeadline);
  };
  
  const filteredBookings = React.useMemo(() => {
    if (!bookings) return [];
    
    const today = startOfToday();
    
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.appointment_date);
      
      switch (filter) {
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
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
          <CardDescription>
            View and manage your appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setFilter(value as any)}>
            <TabsList className="mb-4 w-full sm:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
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
                  <div key={booking.id} className="relative">
                    <BookingCard
                      id={booking.id}
                      userName={booking.businesses?.name || "Business"}
                      serviceName={booking.service_name}
                      appointmentDate={booking.appointment_date}
                      createdAt={booking.created_at}
                      status={booking.status}
                      notes={booking.notes}
                    />
                    {booking.status !== "cancelled" && 
                     booking.status !== "completed" && 
                     canCancelBooking(booking.appointment_date) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-3 right-3"
                        onClick={() => handleCancelBooking(booking)}
                      >
                        <X className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                    )}
                    {booking.status !== "cancelled" && 
                     booking.status !== "completed" && 
                     !canCancelBooking(booking.appointment_date) && (
                      <div className="absolute top-3 right-3 flex items-center text-amber-500 bg-amber-50 p-1 px-2 rounded-md text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Cancellation deadline passed
                      </div>
                    )}
                  </div>
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
                  <div key={booking.id} className="relative">
                    <BookingCard
                      id={booking.id}
                      userName={booking.businesses?.name || "Business"}
                      serviceName={booking.service_name}
                      appointmentDate={booking.appointment_date}
                      createdAt={booking.created_at}
                      status={booking.status}
                      notes={booking.notes}
                    />
                    {booking.status !== "cancelled" && 
                     booking.status !== "completed" && 
                     canCancelBooking(booking.appointment_date) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-3 right-3"
                        onClick={() => handleCancelBooking(booking)}
                      >
                        <X className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                    )}
                    {booking.status !== "cancelled" && 
                     booking.status !== "completed" && 
                     !canCancelBooking(booking.appointment_date) && (
                      <div className="absolute top-3 right-3 flex items-center text-amber-500 bg-amber-50 p-1 px-2 rounded-md text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Cancellation deadline passed
                      </div>
                    )}
                  </div>
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
                  <div key={booking.id} className="relative">
                    <BookingCard
                      id={booking.id}
                      userName={booking.businesses?.name || "Business"}
                      serviceName={booking.service_name}
                      appointmentDate={booking.appointment_date}
                      createdAt={booking.created_at}
                      status={booking.status}
                      notes={booking.notes}
                    />
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <AlertDialog open={!!bookingToCancel} onOpenChange={() => setBookingToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your booking for {bookingToCancel?.service_name} on{" "}
              {bookingToCancel ? format(new Date(bookingToCancel.appointment_date), "PPP 'at' p") : ""}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancelBooking}>
              Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
