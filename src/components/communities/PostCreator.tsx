
import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Send, X, Calendar, CalendarClock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createPost, optimizeImage, generateVideoThumbnail } from "@/services/postService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { SchedulePostDialog } from "./SchedulePostDialog";

type PostCreatorProps = {
  selectedGroup: string | null;
  onPostCreated: () => void;
};

export const PostCreator = ({ selectedGroup, onPostCreated }: PostCreatorProps) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleImageSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageLoading(true);

      // Check if it's an image or video
      if (file.type.startsWith('image/')) {
        // Optimize and get the image
        const optimizedImage = await optimizeImage(file);
        setImage(optimizedImage);
      } else if (file.type.startsWith('video/')) {
        // Generate thumbnail for video
        const thumbnail = await generateVideoThumbnail(file);
        setImage(thumbnail);
        // You could also upload the video separately if needed
      } else {
        toast.error("Unsupported file type");
      }
    } catch (error) {
      console.error("Error processing media:", error);
      toast.error("Error processing media");
    } finally {
      setImageLoading(false);
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !image) {
      toast.error("Please add some content to your post");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to post");
      return;
    }

    try {
      setPosting(true);
      await createPost({
        content,
        image,
        category: "general",
        location: selectedGroup ? undefined : "local",
      });
      
      setContent("");
      setImage(null);
      toast.success("Post created successfully!");
      onPostCreated();
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setPosting(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openScheduleDialog = () => {
    if (!content.trim() && !image) {
      toast.error("Please add some content to schedule");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to schedule posts");
      return;
    }

    setShowScheduleDialog(true);
  };

  const handleScheduleSuccess = () => {
    setContent("");
    setImage(null);
    onPostCreated();
  };

  if (!user) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-6 text-center">
        <p className="text-muted-foreground">Please sign in to create posts</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-6">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.user_metadata?.avatar_url} />
          <AvatarFallback>{user?.email?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-grow space-y-3">
          <Textarea
            placeholder={
              selectedGroup
                ? "Share something with this community..."
                : "What's on your mind?"
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[80px] bg-zinc-800 border-zinc-700 resize-none"
          />

          {imageLoading && (
            <div className="h-40 rounded-md bg-zinc-800 animate-pulse flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Processing media...</p>
            </div>
          )}

          {image && !imageLoading && (
            <div className="relative">
              <img
                src={image}
                alt="Selected"
                className="max-h-96 rounded-md w-full object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex justify-between">
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                className="hidden"
                accept="image/*,video/*"
              />
              <Button
                variant="ghost"
                size="sm"
                type="button"
                disabled={posting || imageLoading}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Media
              </Button>

              <Button
                variant="ghost"
                size="sm"
                type="button"
                disabled={posting || imageLoading}
                onClick={openScheduleDialog}
              >
                <CalendarClock className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </div>

            <Button
              onClick={handlePost}
              disabled={posting || imageLoading || (!content.trim() && !image)}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {posting ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </div>

      <SchedulePostDialog
        open={showScheduleDialog}
        onClose={() => setShowScheduleDialog(false)}
        content={content}
        image={image}
        category="general"
        location={selectedGroup ? undefined : "local"}
        groupId={selectedGroup}
        onSuccess={handleScheduleSuccess}
      />
    </div>
  );
};
