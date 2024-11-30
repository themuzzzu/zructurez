import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { ImageUpload } from "./ImageUpload";

interface CreateBusinessListingProps {
  onClose: () => void;
}

export const CreateBusinessListing = ({ onClose }: CreateBusinessListingProps) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    location: "",
    contact: "",
    hours: "",
    image: null as string | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Business listing submitted for review!");
    onClose();
  };

  return (
    <Card className="p-6 animate-fade-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">List Your Business</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Business Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter your business name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="driving-school">Driving School</SelectItem>
              <SelectItem value="restaurant">Restaurant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your business"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Business address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact">Contact Information</Label>
          <Input
            id="contact"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            placeholder="Phone number or email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hours">Business Hours</Label>
          <Input
            id="hours"
            value={formData.hours}
            onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
            placeholder="e.g., Mon-Fri: 9AM-5PM"
          />
        </div>

        <div className="space-y-2">
          <Label>Business Image</Label>
          <ImageUpload
            selectedImage={formData.image}
            onImageSelect={(image) => setFormData({ ...formData, image })}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Submit Listing
          </Button>
        </div>
      </form>
    </Card>
  );
};