import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Image as ImageIcon, Tag, MapPin, ListChecks, X } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const CreatePost = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  const handleCreatePost = () => {
    toast.info("Create post feature coming soon!");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        toast.success("Photo uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    toast.info("Photo removed");
  };

  const handleCategorySelect = () => {
    toast.info("Category selection feature coming soon!");
  };

  const handlePollCreate = () => {
    toast.info("Poll creation feature coming soon!");
  };

  const handleLocationSelect = (value: string) => {
    setSelectedLocation(value);
    toast.success(`Location scope set to ${value}`);
  };

  return (
    <Card className="p-4 bg-card">
      <div className="flex items-start gap-4">
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
          alt="avatar"
          className="h-10 w-10 rounded-full"
        />
        <div className="flex-1">
          <button
            className="w-full text-left p-3 bg-accent/50 rounded-lg text-muted-foreground transition-all duration-300 hover:bg-accent"
            onClick={handleCreatePost}
          >
            Share something with your neighborhood...
          </button>

          {selectedImage && (
            <div className="relative mt-4">
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Upload photo"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground"
              onClick={handleCategorySelect}
            >
              <Tag className="h-4 w-4 mr-2" />
              Category
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground"
              onClick={handlePollCreate}
            >
              <ListChecks className="h-4 w-4 mr-2" />
              Poll
            </Button>
            <Select onValueChange={handleLocationSelect} value={selectedLocation}>
              <SelectTrigger className="w-[140px]">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground -ml-3"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {selectedLocation || "Location"}
                </Button>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="district">District</SelectItem>
                <SelectItem value="state">State</SelectItem>
                <SelectItem value="national">National</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
};