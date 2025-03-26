
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { EventCard } from "@/components/events/EventCard";
import { CreateEventDialog } from "@/components/events/CreateEventDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SAMPLE_EVENTS = [
  {
    id: 1,
    title: "Community Cleanup Day",
    date: "2024-03-15",
    time: "9:00 AM - 12:00 PM",
    location: "Central Park",
    description: "Join us for our monthly neighborhood cleanup! Bring gloves and water bottle.",
    attendees: 45,
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
    popularity: 3 // 1-5 scale where 5 is most popular
  },
  {
    id: 2,
    title: "Local Food Festival",
    date: "2024-03-20",
    time: "11:00 AM - 8:00 PM",
    location: "Main Street Plaza",
    description: "Celebrate our local cuisine with food vendors, live music, and activities for kids.",
    attendees: 120,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
    popularity: 5
  },
  {
    id: 3,
    title: "Neighborhood Watch Meeting",
    date: "2024-03-25",
    time: "7:00 PM - 8:30 PM",
    location: "Community Center",
    description: "Monthly meeting to discuss community safety and upcoming initiatives.",
    attendees: 28,
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800",
    popularity: 2
  },
  {
    id: 4,
    title: "Tech Startup Mixer",
    date: "2024-04-10",
    time: "6:00 PM - 9:00 PM",
    location: "Innovation Hub",
    description: "Network with local tech entrepreneurs and discover new innovations.",
    attendees: 75,
    image: "https://images.unsplash.com/photo-1591115765373-5207764f72e4?w=800",
    popularity: 4
  }
];

const Events = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [sortOption, setSortOption] = useState("popular");

  // Sort events based on the selected option
  const sortedEvents = useMemo(() => {
    const events = [...SAMPLE_EVENTS];
    
    switch (sortOption) {
      case "popular":
        return events.sort((a, b) => b.popularity - a.popularity);
      case "newest":
        return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case "oldest":
        return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case "mostAttendees":
        return events.sort((a, b) => b.attendees - a.attendees);
      default:
        return events;
    }
  }, [sortOption]);

  // Get popular events (top 2)
  const popularEvents = useMemo(() => {
    return [...SAMPLE_EVENTS]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 2);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Events</h1>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Create Event
        </Button>
      </div>
      
      {popularEvents.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Popular Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularEvents.map((event) => (
              <EventCard key={`popular-${event.id}`} {...event} />
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Events</h2>
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="mostAttendees">Most Attendees</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedEvents.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>

      <CreateEventDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
};

export default Events;
