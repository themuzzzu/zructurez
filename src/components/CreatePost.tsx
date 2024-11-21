import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Image, MessageCircle, Tag } from "lucide-react";

export const CreatePost = () => {
  return (
    <Card className="p-4 mb-6 animate-fade-in">
      <div className="flex items-start gap-4">
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
          alt="avatar"
          className="h-10 w-10 rounded-full"
        />
        <div className="flex-1">
          <button
            className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => alert("Open post modal")}
          >
            What's happening in your neighborhood?
          </button>
          <div className="flex gap-2 mt-4">
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Image className="h-4 w-4 mr-2" />
              Photo
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Tag className="h-4 w-4 mr-2" />
              Category
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};