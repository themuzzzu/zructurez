
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageUpload } from "@/components/image-upload/ImageUpload";
import { PollDialog } from "@/components/chat/PollDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Image, ListChecks, Film, Send } from "lucide-react";

interface PostCreatorProps {
  selectedGroup: string | null;
  onPostCreated: () => void;
}

export const PostCreator = ({ selectedGroup, onPostCreated }: PostCreatorProps) => {
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [isPollDialogOpen, setIsPollDialogOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifSearch, setGifSearch] = useState("");
  const [gifs, setGifs] = useState<any[]>([]);

  const TENOR_API_KEY = "LIVDSRZULELA"; // Use env variable in production
  const TENOR_CLIENT_KEY = "marketplace_app";

  const createPost = async () => {
    if (!postContent.trim() && !selectedImage && !selectedGif) {
      toast.error("Please add some content to your post");
      return;
    }

    if (!selectedGroup) {
      toast.error("Please select a group to post to");
      return;
    }

    setIsPosting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to post");
        return;
      }

      // Get user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profileData) {
        toast.error("Profile not found");
        return;
      }

      const postData = {
        content: postContent,
        group_id: selectedGroup,
        user_id: user.id,
        profile_id: profileData.id
      };

      if (selectedImage) {
        postData.image_url = selectedImage;
      }

      if (selectedGif) {
        postData.gif_url = selectedGif;
      }

      const { error } = await supabase
        .from('posts')
        .insert(postData)
        .select();

      if (error) {
        throw error;
      }

      setPostContent("");
      setSelectedImage(null);
      setSelectedGif(null);
      onPostCreated();
      toast.success("Post created successfully");
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error("Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  const handleCreatePoll = async (question: string, options: string[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to create a poll");
        return;
      }

      // Insert poll with options as JSON
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .insert({
          question,
          user_id: user.id,
          options // Store options directly as JSON
        })
        .select();

      if (pollError || !pollData?.[0]) {
        throw pollError;
      }

      const pollId = pollData[0].id;

      // Get user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      // Create a post with the poll
      if (selectedGroup) {
        const { error: postError } = await supabase
          .from('posts')
          .insert({
            content: question,
            group_id: selectedGroup,
            poll_id: pollId,
            user_id: user.id,
            profile_id: profileData?.id
          });

        if (postError) {
          throw postError;
        }
      }

      onPostCreated();
      setIsPollDialogOpen(false);
      toast.success("Poll created successfully");
    } catch (error) {
      console.error('Error creating poll:', error);
      toast.error("Failed to create poll");
    }
  };

  const searchGifs = async (searchTerm: string) => {
    try {
      const response = await fetch(
        `https://api.tenor.com/v1/search?q=${encodeURIComponent(searchTerm)}&key=${TENOR_API_KEY}&client_key=${TENOR_CLIENT_KEY}&limit=12`
      );
      
      const data = await response.json();
      setGifs(data.results || []);
    } catch (error) {
      console.error('Error searching GIFs:', error);
      toast.error("Failed to load GIFs");
    }
  };

  const handleGifClick = (gifUrl: string) => {
    setSelectedGif(gifUrl);
    setShowGifPicker(false);
  };

  return (
    <Card className="p-4 mb-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Share something with the community..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        {selectedImage && (
          <div className="relative mt-2">
            <img 
              src={selectedImage} 
              alt="Selected image" 
              className="max-h-60 rounded-md object-contain"
            />
            <Button 
              variant="destructive" 
              size="sm" 
              className="absolute top-2 right-2"
              onClick={() => setSelectedImage(null)}
            >
              Remove
            </Button>
          </div>
        )}

        {selectedGif && (
          <div className="relative mt-2">
            <img 
              src={selectedGif} 
              alt="Selected GIF" 
              className="max-h-60 rounded-md object-contain"
            />
            <Button 
              variant="destructive" 
              size="sm" 
              className="absolute top-2 right-2"
              onClick={() => setSelectedGif(null)}
            >
              Remove
            </Button>
          </div>
        )}

        {!selectedImage && (
          <div className="mt-2">
            <ImageUpload
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
              skipAutoSave={true}
            />
          </div>
        )}

        {showGifPicker && (
          <div className="mt-2 p-2 border rounded-md">
            <div className="mb-2">
              <Input
                placeholder="Search GIFs..."
                value={gifSearch}
                onChange={(e) => setGifSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    searchGifs(gifSearch);
                  }
                }}
              />
              <Button 
                className="mt-2" 
                variant="outline"
                onClick={() => searchGifs(gifSearch)}
              >
                Search
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-2 max-h-[300px] overflow-y-auto">
              {gifs.length === 0 ? (
                <div className="col-span-3 text-center py-4 text-sm text-muted-foreground">
                  Search for GIFs to see results
                </div>
              ) : (
                gifs.map((gif, index) => (
                  <div 
                    key={index} 
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleGifClick(gif.media[0].gif.url)}
                  >
                    <img 
                      src={gif.media[0].gif.preview} 
                      alt={gif.content_description} 
                      className="w-full h-24 object-cover rounded-md"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedImage(null)}
            disabled={!!selectedImage}
          >
            <Image className="h-4 w-4 mr-2" />
            Image
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setShowGifPicker(!showGifPicker);
              if (!showGifPicker) {
                setGifs([]);
                setGifSearch("");
              }
            }}
          >
            <Film className="h-4 w-4 mr-2" />
            GIF
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsPollDialogOpen(true)}
          >
            <ListChecks className="h-4 w-4 mr-2" />
            Poll
          </Button>
          <Button 
            className="ml-auto"
            onClick={createPost}
            disabled={isPosting || (!postContent.trim() && !selectedImage && !selectedGif)}
          >
            <Send className="h-4 w-4 mr-2" />
            {isPosting ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>

      {/* Poll creation dialog */}
      <PollDialog
        open={isPollDialogOpen}
        onOpenChange={setIsPollDialogOpen}
        onCreatePoll={handleCreatePoll}
      />
    </Card>
  );
};
