import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ImageUpload";
import { VideoUpload } from "./VideoUpload";
import { DocumentUpload } from "./DocumentUpload";
import { PollDialog } from "./PollDialog";
import { ContactDialog } from "./ContactDialog";
import { ContactInfoDialog } from "./ContactInfoDialog";
import { Chat } from "@/types/chat";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ChatDialogsProps {
  selectedChat: Chat;
  showContactInfo: boolean;
  setShowContactInfo: (show: boolean) => void;
  showImageUpload: boolean;
  setShowImageUpload: (show: boolean) => void;
  showVideoUpload: boolean;
  setShowVideoUpload: (show: boolean) => void;
  showDocumentUpload: boolean;
  setShowDocumentUpload: (show: boolean) => void;
  showPollDialog: boolean;
  setShowPollDialog: (show: boolean) => void;
  showContactDialog: boolean;
  setShowContactDialog: (show: boolean) => void;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  selectedVideo: string | null;
  setSelectedVideo: (video: string | null) => void;
}

export const ChatDialogs = ({
  selectedChat,
  showContactInfo,
  setShowContactInfo,
  showImageUpload,
  setShowImageUpload,
  showVideoUpload,
  setShowVideoUpload,
  showDocumentUpload,
  setShowDocumentUpload,
  showPollDialog,
  setShowPollDialog,
  showContactDialog,
  setShowContactDialog,
  selectedImage,
  setSelectedImage,
  selectedVideo,
  setSelectedVideo,
}: ChatDialogsProps) => {
  return (
    <>
      <ContactInfoDialog
        open={showContactInfo}
        onOpenChange={setShowContactInfo}
        chat={selectedChat}
      />

      <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
        <DialogContent>
          <ImageUpload
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showVideoUpload} onOpenChange={setShowVideoUpload}>
        <DialogContent>
          <VideoUpload
            selectedVideo={selectedVideo}
            onVideoSelect={setSelectedVideo}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showDocumentUpload} onOpenChange={setShowDocumentUpload}>
        <DialogContent>
          <DocumentUpload
            onDocumentUpload={async (file) => {
              try {
                const fileName = `${Date.now()}_${file.name}`;
                const filePath = `chat-documents/${fileName}`;

                const { error: uploadError } = await supabase.storage
                  .from("chat-documents")
                  .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                  .from("chat-documents")
                  .getPublicUrl(filePath);

                const { error: docError } = await supabase
                  .from("documents")
                  .insert({
                    title: file.name,
                    file_url: publicUrl,
                    file_type: file.type,
                    user_id: "me",
                  });

                if (docError) throw docError;

                setShowDocumentUpload(false);
                toast.success("Document uploaded successfully!");
              } catch (error) {
                console.error("Error uploading document:", error);
                toast.error("Failed to upload document");
              }
            }}
          />
        </DialogContent>
      </Dialog>

      <PollDialog
        open={showPollDialog}
        onOpenChange={setShowPollDialog}
        onCreatePoll={async (question, options) => {
          try {
            const { error } = await supabase
              .from("polls")
              .insert({
                question,
                options,
                user_id: "me",
              });

            if (error) throw error;

            setShowPollDialog(false);
            toast.success("Poll created successfully!");
          } catch (error) {
            console.error("Error creating poll:", error);
            toast.error("Failed to create poll");
          }
        }}
      />

      <ContactDialog
        open={showContactDialog}
        onOpenChange={setShowContactDialog}
        onShareContact={async (contactData) => {
          try {
            const { error } = await supabase
              .from("shared_contacts")
              .insert({
                contact_data: contactData,
                user_id: "me",
                shared_with_id: selectedChat.userId,
              });

            if (error) throw error;

            setShowContactDialog(false);
            toast.success("Contact shared successfully!");
          } catch (error) {
            console.error("Error sharing contact:", error);
            toast.error("Failed to share contact");
          }
        }}
      />
    </>
  );
};