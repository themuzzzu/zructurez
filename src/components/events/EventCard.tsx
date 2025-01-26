import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Users2 } from "lucide-react";
import { toast } from "sonner";

interface EventCardProps {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  attendees: number;
  image: string;
}

export const EventCard = ({
  id,
  title,
  date,
  time,
  location,
  description,
  attendees,
  image,
}: EventCardProps) => {
  const handleAttend = () => {
    toast.success("You're now attending this event!");
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            {date}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            {time}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            {location}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users2 className="h-4 w-4 mr-2" />
            {attendees} attending
          </div>
        </div>
        <p className="text-muted-foreground mb-4">{description}</p>
        <Button 
          className="w-full"
          onClick={handleAttend}
        >
          Attend Event
        </Button>
      </div>
    </Card>
  );
};