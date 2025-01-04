import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Chat } from "@/types/chat";

export const useMessageHandling = (
  selectedChat: Chat | null,
  message: string,
  onMessageChange: (message: string) => void,
  onSendMessage: () => void
) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!selectedChat) return;

    // First check if the receiver exists
    const { data: receiverExists, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', selectedChat.userId)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking receiver:", checkError);
      toast.error("Error verifying recipient");
      return;
    }

    if (!receiverExists) {
      toast.error("Invalid recipient. Please select a valid chat.");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to send messages");
        return;
      }

      const { error: messageError } = await supabase
        .from("messages")
        .insert({
          content: message,
          sender_id: user.id,
          receiver_id: selectedChat.userId,
        });

      if (messageError) throw messageError;

      onMessageChange("");
      onSendMessage();
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleSendImage = async () => {
    if (!selectedImage || !selectedChat) return;

    try {
      const file = await fetch(selectedImage).then((r) => r.blob());
      const fileExt = "jpg";
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `chat-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("chat-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("chat-images")
        .getPublicUrl(filePath);

      const { error: messageError } = await supabase
        .from("messages")
        .insert({
          content: message || "Sent an image",
          sender_id: "me",
          receiver_id: selectedChat.userId,
          image_url: publicUrl,
        });

      if (messageError) throw messageError;

      setSelectedImage(null);
      onMessageChange("");
      toast.success("Image sent successfully!");
    } catch (error) {
      console.error("Error sending image:", error);
      toast.error("Failed to send image");
    }
  };

  const handleSendVideo = async () => {
    if (!selectedVideo || !selectedChat) return;

    try {
      const file = await fetch(selectedVideo).then((r) => r.blob());
      const fileExt = "mp4";
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `chat-videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("chat-videos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("chat-videos")
        .getPublicUrl(filePath);

      const { error: messageError } = await supabase
        .from("messages")
        .insert({
          content: message || "Sent a video",
          sender_id: "me",
          receiver_id: selectedChat.userId,
          video_url: publicUrl,
        });

      if (messageError) throw messageError;

      setSelectedVideo(null);
      onMessageChange("");
      toast.success("Video sent successfully!");
    } catch (error) {
      console.error("Error sending video:", error);
      toast.error("Failed to send video");
    }
  };

  return {
    selectedImage,
    setSelectedImage,
    selectedVideo,
    setSelectedVideo,
    handleSendMessage,
    handleSendImage,
    handleSendVideo,
  };
};
