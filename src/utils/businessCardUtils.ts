
import { toast } from "sonner";

export const shareBusinessProfile = (e: React.MouseEvent, name: string, description: string, id: string) => {
  e.stopPropagation();
  const businessUrl = `${window.location.origin}/business/${id}`;
  
  if (navigator.share) {
    navigator.share({
      title: name,
      text: `Check out ${name} - ${description}`,
      url: businessUrl
    }).catch(() => {
      navigator.clipboard.writeText(businessUrl);
      toast.success("Link copied to clipboard!");
    });
  } else {
    navigator.clipboard.writeText(businessUrl);
    toast.success("Link copied to clipboard!");
  }
};

export const openWhatsAppChat = (e: React.MouseEvent, name: string, contact: string) => {
  e.stopPropagation();
  const greeting = `Hi! I found your business profile for ${name}. I'm interested in learning more about your services.`;
  const whatsappUrl = `https://wa.me/${contact.replace(/\D/g, '')}?text=${encodeURIComponent(greeting)}`;
  window.open(whatsappUrl, '_blank');
};
