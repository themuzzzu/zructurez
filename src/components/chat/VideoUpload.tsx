import { useState } from "react";
import { Button } from "../ui/button";
import { X, Video } from "lucide-react";
import { toast } from "sonner";

export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
export const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

interface VideoUploadProps {
  selectedVideo: string | null;
  onVideoSelect: (video: string | null) => void;
}

export const VideoUpload = ({ selectedVideo, onVideoSelect }: VideoUploadProps) => {
  const handleFileUpload = (file: File) => {
    if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      toast.error("Please upload a valid video file (MP4, WebM, or QuickTime)");
      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      toast.error("Video size should be less than 100MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      onVideoSelect(e.target?.result as string);
      toast.success("Video uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFileUpload(file);
  };

  const handleRemoveVideo = () => {
    onVideoSelect(null);
    toast.info("Video removed");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => document.getElementById('video-upload')?.click()}
        >
          <Video className="h-4 w-4" />
          Choose Video
        </Button>
        <input
          id="video-upload"
          type="file"
          accept={ACCEPTED_VIDEO_TYPES.join(',')}
          onChange={handleVideoUpload}
          className="hidden"
        />
      </div>

      {selectedVideo && (
        <div className="relative mt-4 group">
          <video
            src={selectedVideo}
            controls
            className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={handleRemoveVideo}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};