import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Chat } from "@/types/chat";

interface ChatDialogsProps {
  selectedChat: Chat | null;
  showNewChat: boolean;
  showContactInfo?: boolean;
  setShowContactInfo?: (show: boolean) => void;
  showImageUpload?: boolean;
  setShowImageUpload?: (show: boolean) => void;
  showVideoUpload?: boolean;
  setShowVideoUpload?: (show: boolean) => void;
  showDocumentUpload?: boolean;
  setShowDocumentUpload?: (show: boolean) => void;
  showPollDialog?: boolean;
  setShowPollDialog?: (show: boolean) => void;
  showContactDialog?: boolean;
  setShowContactDialog?: (show: boolean) => void;
  selectedImage?: string | null;
  setSelectedImage?: (image: string | null) => void;
  selectedVideo?: string | null;
  setSelectedVideo?: (video: string | null) => void;
  onNewChat: (userId: string) => Promise<void>;
  onCloseNewChat: () => void;
}

export const ChatDialogs = ({
  selectedChat,
  showNewChat,
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
  onNewChat,
  onCloseNewChat,
}: ChatDialogsProps) => {
  return (
    <Dialog open={showNewChat} onOpenChange={onCloseNewChat}>
      <DialogContent>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">New Chat</h2>
          <input
            type="text"
            placeholder="Enter user ID..."
            className="w-full p-2 border rounded"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onNewChat((e.target as HTMLInputElement).value);
              }
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};