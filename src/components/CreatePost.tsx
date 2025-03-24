
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

interface CreatePostProps {
  onSuccess?: () => void;
}

export const CreatePost = ({ onSuccess }: CreatePostProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserAvatar(profile.avatar_url);
        }
      }
    };

    fetchUserProfile();
  }, []);

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
    <Card className="p-4 bg-white dark:bg-black/90 border-gray-200 dark:border-zinc-800 shadow-md dark:shadow-lg">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage 
            src={userAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
            alt="User avatar" 
          />
          <AvatarFallback>User</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Share something with your neighborhood..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] bg-gray-50 dark:bg-black/50 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-black/60 focus:bg-gray-100 dark:focus:bg-black/60 transition-colors duration-300 border-gray-200 dark:border-zinc-800 placeholder:text-gray-500 dark:placeholder:text-gray-400"
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
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-black/60"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-black/60"
              onClick={() => toast.info("Category selection feature coming soon!")}
            >
              <Tag className="h-4 w-4 mr-2" />
              Category
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-black/60"
              onClick={() => toast.info("Poll creation feature coming soon!")}
            >
              <ListChecks className="h-4 w-4 mr-2" />
              Poll
            </Button>
            <Select onValueChange={setSelectedLocation} value={selectedLocation}>
              <SelectTrigger className="w-[140px] bg-gray-50 dark:bg-black/50 border-gray-200 dark:border-zinc-800">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 -ml-3"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {selectedLocation || "Location"}
                </Button>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-black/90 border-gray-200 dark:border-zinc-800">
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
