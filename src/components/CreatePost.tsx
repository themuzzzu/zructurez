import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Image, MessageCircle, Tag, MapPin, ListChecks } from "lucide-react";

export const CreatePost = () => {
  return (
    <Card className="p-4 mb-6 animate-fade-up bg-card">
      <div className="flex items-start gap-4">
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
          alt="avatar"
          className="h-10 w-10 rounded-full transition-transform duration-300 hover:scale-110"
        />
        <div className="flex-1">
          <button
            className="w-full text-left p-3 bg-accent/50 rounded-lg transition-all duration-300 hover:bg-accent hover:shadow-lg"
            onClick={() => alert("Open post modal")}
          >
            What's happening in your neighborhood, Felix?
          </button>
          <div className="flex flex-wrap gap-2 mt-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground transition-all duration-300 hover:scale-105 hover:bg-accent/80">
              <Image className="h-4 w-4 mr-2" />
              Photo
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground transition-all duration-300 hover:scale-105 hover:bg-accent/80">
              <Tag className="h-4 w-4 mr-2" />
              Category
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground transition-all duration-300 hover:scale-105 hover:bg-accent/80">
              <ListChecks className="h-4 w-4 mr-2" />
              Poll
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground transition-all duration-300 hover:scale-105 hover:bg-accent/80">
              <MapPin className="h-4 w-4 mr-2" />
              Location
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};