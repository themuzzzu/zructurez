
import React from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, User, Briefcase } from "lucide-react";

interface BookingCardProps {
  id: string;
  userName: string;
  serviceName: string;
  appointmentDate: string; // ISO string
  createdAt: string; // ISO string
  status: string;
  notes?: string | null;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  id,
  userName,
  serviceName,
  appointmentDate,
  createdAt,
  status,
  notes,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      case "completed":
        return "bg-blue-500";
      default:
        return "bg-yellow-500"; // pending
    }
  };

  return (
    <Card className="mb-4 overflow-hidden border hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">{userName}</h3>
            </div>
            
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{serviceName}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">
                {format(new Date(appointmentDate), "PPP")}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">
                {format(new Date(appointmentDate), "p")}
              </p>
            </div>

            {notes && (
              <p className="text-sm text-muted-foreground mt-2">{notes}</p>
            )}
          </div>

          <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end gap-2">
            <Badge className={getStatusColor(status)}>{status}</Badge>
            <p className="text-xs text-muted-foreground">
              Booked on {format(new Date(createdAt), "PPP 'at' p")}
            </p>
            <p className="text-xs text-muted-foreground">ID: {id.substring(0, 8)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
