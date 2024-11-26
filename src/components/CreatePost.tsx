import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Image, Tag, MapPin, ListChecks } from "lucide-react";
import { toast } from "sonner";

export const CreatePost = () => {
  const handleCreatePost = () => {
    toast.info("Create post feature coming soon!");
  };

  const handlePhotoUpload = () => {
    toast.info("Photo upload feature coming soon!");
  };

  const handleCategorySelect = () => {
    toast.info("Category selection feature coming soon!");
  };

  const handlePollCreate = () => {
    toast.info("Poll creation feature coming soon!");
  };

  const handleLocationAdd = () => {
    toast.info("Location adding feature coming soon!");
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
          <div className="flex flex-wrap gap-2 mt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground"
              onClick={handlePhotoUpload}
            >
              <Image className="h-4 w-4 mr-2" />
              Photo
            </Button>
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
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground"
              onClick={handleLocationAdd}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Location
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};