import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Clock, Users2, ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ImageUpload";

const SAMPLE_EVENTS = [
  {
    id: 1,
    title: "Community Cleanup Day",
    date: "2024-03-15",
    time: "9:00 AM - 12:00 PM",
    location: "Central Park",
    description: "Join us for our monthly neighborhood cleanup! Bring gloves and water bottle.",
    attendees: 45,
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800"
  },
  {
    id: 2,
    title: "Local Food Festival",
    date: "2024-03-20",
    time: "11:00 AM - 8:00 PM",
    location: "Main Street Plaza",
    description: "Celebrate our local cuisine with food vendors, live music, and activities for kids.",
    attendees: 120,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800"
  },
  {
    id: 3,
    title: "Neighborhood Watch Meeting",
    date: "2024-03-25",
    time: "7:00 PM - 8:30 PM",
    location: "Community Center",
    description: "Monthly meeting to discuss community safety and upcoming initiatives.",
    attendees: 28,
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800"
  }
];

const Events = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    image: null as string | null,
  });

  const handleAttend = (eventId: number) => {
    toast.success("You're now attending this event!");
  };

  const handleCreateEvent = async () => {
    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsCreating(true);
    try {
      const { data: event, error } = await supabase
        .from("events")
        .insert({
          title: formData.title,
          description: formData.description,
          date: new Date(formData.date).toISOString(),
          time: formData.time,
          location: formData.location,
          image_url: formData.image,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Event created successfully!");
      setIsCreateDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        image: null,
      });
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-[1400px] pt-20 pb-16">
        <div className="flex gap-6">
          <Sidebar className="w-64 hidden lg:block" />
          <main className="flex-1">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SAMPLE_EVENTS.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-4">{event.title}</h3>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          {event.date}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          {event.time}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          {event.location}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users2 className="h-4 w-4 mr-2" />
                          {event.attendees} attending
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4">{event.description}</p>
                      <Button 
                        className="w-full"
                        onClick={() => handleAttend(event.id)}
                      >
                        Attend Event
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Event Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Event Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <ImageUpload
              selectedImage={formData.image}
              onImageSelect={(image) => setFormData({ ...formData, image })}
            />
            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateEvent} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;