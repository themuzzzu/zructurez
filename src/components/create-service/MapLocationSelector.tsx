import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { MapPin } from "lucide-react";

interface MapLocationSelectorProps {
  value: string;
  onChange: (location: string) => void;
}

export const MapLocationSelector = ({ value, onChange }: MapLocationSelectorProps) => {
  const [open, setOpen] = useState(false);

  const handleLocationSelect = () => {
    // For now, we'll just use Tadipatri as the default location
    onChange("Tadipatri, Andhra Pradesh");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button" className="w-full justify-start gap-2">
          <MapPin className="h-4 w-4" />
          {value || "Select location from map..."}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Location</DialogTitle>
        </DialogHeader>
        <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30844.73348794849!2d77.98140110185223!3d14.904093129595008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb41cadcd3b8d9f%3A0xd1bff73d9d4719fc!2sTadipatri%2C%20Andhra%20Pradesh%20515411!5e0!3m2!1sen!2sin!4v1735066470408!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location Map"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleLocationSelect}>Select Location</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};