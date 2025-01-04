import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useAttachments = () => {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showPollDialog, setShowPollDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);

  const handleAttachment = (type: string) => {
    switch (type) {
      case "photo":
        setShowImageUpload(true);
        break;
      case "video":
        setShowVideoUpload(true);
        break;
      case "document":
        setShowDocumentUpload(true);
        break;
      case "contact":
        setShowContactDialog(true);
        break;
      case "poll":
        setShowPollDialog(true);
        break;
      case "drawing":
        toast.info("Drawing feature coming soon!");
        break;
      default:
        break;
    }
  };

  return {
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
    handleAttachment,
  };
};