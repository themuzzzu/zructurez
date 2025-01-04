import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Image as ImageIcon, Tag, MapPin, ListChecks } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { ImageUpload, ACCEPTED_IMAGE_TYPES } from "./ImageUpload";
import { createPost } from "../services/postService";

interface CreatePostProps {
  onSuccess?: () => void;
}

export const CreatePost = ({ onSuccess }: CreatePostProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handleCreatePost = async () => {
    if (!content.trim()) {
      toast.error("Please write something to post");
      return;
    }

    setIsPosting(true);
    try {
      await createPost({
        content,
        location: selectedLocation,
        image: selectedImage,
        category: null,
      });

      // Reset form
      setContent("");
      setSelectedImage(null);
      setSelectedLocation("");
      
      toast.success("Post created successfully!");
      onSuccess?.();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="p-4 bg-[#1A1F2C] border-[#2A2F3C] shadow-lg">
      <div className="flex items-start gap-4">
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
          alt="avatar"
          className="h-10 w-10 rounded-full"
        />
        <div className="flex-1">
          <Textarea
            placeholder="Share something with your neighborhood..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] bg-[#222632] text-gray-200 hover:bg-[#272B38] focus:bg-[#272B38] transition-colors duration-300 border-[#2A2F3C] placeholder:text-gray-400"
          />

          <ImageUpload 
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
          />

          <div className="flex flex-wrap gap-2 mt-4">
            <div className="relative">
              <input
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setSelectedImage(e.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Upload photo"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-gray-200 hover:bg-[#272B38]"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-gray-200 hover:bg-[#272B38]"
              onClick={() => toast.info("Category selection feature coming soon!")}
            >
              <Tag className="h-4 w-4 mr-2" />
              Category
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-gray-200 hover:bg-[#272B38]"
              onClick={() => toast.info("Poll creation feature coming soon!")}
            >
              <ListChecks className="h-4 w-4 mr-2" />
              Poll
            </Button>
            <Select onValueChange={setSelectedLocation} value={selectedLocation}>
              <SelectTrigger className="w-[140px] bg-[#222632] border-[#2A2F3C]">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-gray-200 -ml-3"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {selectedLocation || "Location"}
                </Button>
              </SelectTrigger>
              <SelectContent className="bg-[#1A1F2C] border-[#2A2F3C]">
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="district">District</SelectItem>
                <SelectItem value="state">State</SelectItem>
                <SelectItem value="national">National</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              className="ml-auto bg-primary hover:bg-secondary"
              onClick={handleCreatePost}
              disabled={isPosting || !content.trim()}
            >
              {isPosting ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};